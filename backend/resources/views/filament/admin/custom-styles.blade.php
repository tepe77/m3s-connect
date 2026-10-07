<style>
    /* Styling khusus Halaman Login / Auth Filament */
    .fi-simple-layout {
        background-color: #f8fafc;
        background-image: 
            radial-gradient(at 10% 10%, rgba(13, 148, 136, 0.12) 0px, transparent 45%),
            radial-gradient(at 90% 90%, rgba(20, 184, 166, 0.08) 0px, transparent 45%),
            radial-gradient(at 50% 50%, rgba(241, 245, 249, 0.5) 0px, transparent 100%);
        min-height: 100vh;
        position: relative;
    }

    .dark .fi-simple-layout {
        background-color: #0f172a;
        background-image: 
            radial-gradient(at 10% 10%, rgba(13, 148, 136, 0.18) 0px, transparent 50%),
            radial-gradient(at 90% 90%, rgba(15, 118, 110, 0.14) 0px, transparent 50%),
            radial-gradient(at 50% 50%, rgba(30, 41, 59, 0.4) 0px, transparent 100%);
    }

    /* Kartu Login Utama */
    .fi-simple-main {
        border-radius: 1.5rem !important;
        border: 1px solid rgba(226, 232, 240, 0.8) !important;
        box-shadow: 
            0 20px 25px -5px rgba(15, 23, 42, 0.05),
            0 8px 10px -6px rgba(15, 23, 42, 0.03) !important;
        backdrop-filter: blur(8px);
        transition: all 0.2s ease-in-out;
    }

    .dark .fi-simple-main {
        border: 1px solid rgba(51, 65, 85, 0.6) !important;
        box-shadow: 
            0 25px 30px -5px rgba(0, 0, 0, 0.35),
            0 10px 15px -5px rgba(0, 0, 0, 0.2) !important;
    }

    /* Heading login */
    .fi-simple-header-heading {
        font-weight: 800 !important;
        letter-spacing: -0.025em !important;
        color: #0f172a !important;
    }

    .dark .fi-simple-header-heading {
        color: #f8fafc !important;
    }

    /* Tombol Utama */
    .fi-btn-primary {
        background-color: #0d9488 !important;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
        font-weight: 700 !important;
        border-radius: 0.75rem !important;
    }

    .fi-btn-primary:hover {
        background-color: #0f766e !important;
        box-shadow: 0 4px 12px rgba(13, 148, 136, 0.25) !important;
    }
</style>
