"use client";

import { useEffect } from "react";

export function DisableDevTools() {
    useEffect(() => {
        // Prevent right click
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        // Prevent keyboard shortcuts
        const handleKeyDown = (e: KeyboardEvent) => {
            // F12
            if (e.key === "F12") {
                e.preventDefault();
            }

            // Ctrl+Shift+I / Cmd+Opt+I (Inspect)
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "I" || e.key === "i" || e.keyCode === 73)) {
                e.preventDefault();
            }

            // Ctrl+Shift+J / Cmd+Opt+J (Console)
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "J" || e.key === "j" || e.keyCode === 74)) {
                e.preventDefault();
            }

            // Ctrl+Shift+C / Cmd+Opt+C (Inspect Element)
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "C" || e.key === "c" || e.keyCode === 67)) {
                e.preventDefault();
            }

            // Ctrl+U / Cmd+U (View Source)
            if ((e.ctrlKey || e.metaKey) && (e.key === "U" || e.key === "u" || e.keyCode === 85)) {
                e.preventDefault();
            }
        };

        document.addEventListener("contextmenu", handleContextMenu);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("contextmenu", handleContextMenu);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return null;
}
