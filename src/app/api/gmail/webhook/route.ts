import { NextResponse } from 'next/server';
import { processIncomingEmail } from '@/lib/gmail-sync';

// This endpoint receives incoming Push Notifications from Google Cloud Pub/Sub
// whenever a new email arrives in a linked account.
// It guarantees near-instantaneous execution (< 15 seconds)

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Google Pub/Sub sends the data as a base64 encoded string
        if (!body.message || !body.message.data) {
            return NextResponse.json({ error: "Invalid Pub/Sub payload" }, { status: 400 });
        }

        // Decode the payload
        const decodedData = Buffer.from(body.message.data, 'base64').toString('utf-8');
        const parsedData = JSON.parse(decodedData);

        const { emailAddress, historyId } = parsedData;

        console.log(`[Webhook Triggered] New email event for: ${emailAddress} | HistoryId: ${historyId}`);

        // If this is an actual email address we are tracking (e.g. Coordinator or Faculty)
        if (emailAddress && historyId) {

            // Async background task: Go fetch and parse this specific email
            // We do NOT block the webhook response, we let this run in the background
            // so Google Pub/Sub gets a fast 200 OK and doesn't retry.

            processIncomingEmail(historyId, emailAddress)
                .catch(err => console.error("Background Email Sync Failed:", err));

        }

        // Always return 200 OK to acknowledge receipt to Pub/Sub instantly
        return NextResponse.json({ success: true, status: "processing_in_background" });

    } catch (error) {
        console.error("Webhook processing error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
