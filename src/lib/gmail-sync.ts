import 'server-only';
import { google } from 'googleapis';
import { parseEmailText, syncEmailDataToFirebase } from '@/lib/emailParser';

// Initialize OAuth2 client
const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    process.env.GMAIL_REDIRECT_URI
);

// We need an admin/service account token or individual user tokens to read the mail.
// For a fully automated background service reading all designated @edu.in accounts,
// a Domain-Wide Delegation Service Account is typically used, OR you store refresh
// tokens for each Faculty/Coordinator when they link their account.

export async function processIncomingEmail(historyId: string, userEmailAddress: string) {
    try {
        // 1. Authenticate (Assuming we fetch the user's refresh token from DB)
        // const userToken = await getRefreshTokenFromDB(userEmailAddress);
        // oauth2Client.setCredentials({ refresh_token: userToken });

        // For demo/setup purposes, we assume credentials are set
        const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

        // 2. Fetch the latest messages that triggered this webhook
        const historyRes = await gmail.users.history.list({
            userId: 'me',
            startHistoryId: historyId,
        });

        if (!historyRes.data.history) return;

        for (const record of historyRes.data.history) {
            if (record.messagesAdded) {
                for (const messageAdded of record.messagesAdded) {
                    const msgId = messageAdded.message?.id;
                    if (!msgId) continue;

                    // 3. Get the full email content
                    const fullMsg = await gmail.users.messages.get({
                        userId: 'me',
                        id: msgId,
                        format: 'full',
                    });

                    // 3.5 STRICT RESTRICTION: Only process emails from the Sent Box
                    const labelIds = fullMsg.data.labelIds || [];
                    if (!labelIds.includes('SENT')) {
                        console.log(`[Dropped] Message ${msgId} is not a Sent email.`);
                        continue;
                    }

                    const headers = fullMsg.data.payload?.headers;
                    const fromHeader = headers?.find(h => h.name === 'From')?.value || '';
                    const subjectHeader = headers?.find(h => h.name === 'Subject')?.value || '';

                    console.log(`Analyzing new SENT email from: ${fromHeader}`);

                    // 4. STRICT RESTRICTION: Must be from @edu.in format
                    // This ensures only official faculty/coordinators can trigger system updates
                    if (!fromHeader.toLowerCase().includes('@edu.in')) {
                        console.log(`[Rejected] Sender ${fromHeader} is not an official @edu.in domain.`);
                        continue; // Safely drop this email
                    }

                    // 5. Extract body text (simplistic extraction for MVP)
                    let bodyText = subjectHeader + "\n\n";

                    let parts = fullMsg.data.payload?.parts;
                    if (parts && parts.length > 0) {
                        const textPart = parts.find(p => p.mimeType === 'text/plain');
                        if (textPart?.body?.data) {
                            bodyText += Buffer.from(textPart.body.data, 'base64').toString('ascii');
                        }
                    }

                    console.log(`Valid @edu.in email received. Running AI Parser...`);

                    // 6. Pass to our existing parsing engine
                    const parsedData = await parseEmailText(bodyText);

                    if (parsedData.type !== 'unknown') {
                        console.log(`Extracted: ${parsedData.type}. Syncing to Firebase...`);
                        // 7. Sync data instantly to Firebae (< 15 seconds from receipt)
                        const docId = await syncEmailDataToFirebase(parsedData);
                        console.log(`Successfully synced to database! ID: ${docId}`);
                    }
                }
            }
        }
    } catch (error) {
        console.error("Error processing incoming email:", error);
    }
}
