// --- 1. ULTIMATE PRESENCE SYSTEM (Fixes 2-3 sec issue) ---
function startPresenceSystem() {
    if (!myUid) return; // Agar login nahi hai to run mat karo

    const myKey = myUid.replace(/[^a-zA-Z0-9]/g, "");
    const myStatusRef = db.ref('online_status/' + myKey);
    const connectedRef = db.ref('.info/connected');

    connectedRef.on('value', (snap) => {
        if (snap.val() === true) {
            // Hum connect ho gaye hain
            // 1. Server ko bolo: "Agar main disconnect hun, to mujhe remove kar dena"
            myStatusRef.onDisconnect().remove();
            
            // 2. Abhi ke liye status TRUE set karo
            myStatusRef.set(true);
        }
    });
}
// --- 2. UNIVERSAL BULB WATCHER ---
function watchPartnerStatus(targetUid) {
    if (!targetUid) return;
    
    const targetKey = targetUid.replace(/[^a-zA-Z0-9]/g, "");
    
    // Sirf ek baar listener lagao
    db.ref('online_status/' + targetKey).on('value', (snap) => {
        const isOnline = (snap.exists() && snap.val() === true);

        // A. CHAT PAGE KA BULB (Andar wala)
        const chatBulb = document.getElementById('live-chat-bulb');
        const chatText = document.getElementById('live-status-text');
        
        if (chatBulb) {
            if (isOnline) {
                chatBulb.classList.add('online-now');
                if(chatText) { chatText.innerText = "Active Now"; chatText.style.color = "#00ff88"; }
            } else {
                chatBulb.classList.remove('online-now');
                if(chatText) { chatText.innerText = "Offline"; chatText.style.color = "#888"; }
            }
        }

        // B. DASHBOARD KA BULB (Bahar wala - Agar aapne list me lagaya hai)
        // Note: Agar aap user list use kar rahe hain, to har user ka alag ID hona chahiye
        const dashboardBulb = document.getElementById('bulb-' + targetUid); 
        if (dashboardBulb) {
            if (isOnline) dashboardBulb.classList.add('online-now');
            else dashboardBulb.classList.remove('online-now');
        }
    });
}