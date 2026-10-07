<div class="mt-6 pt-5 border-t border-slate-200/80 dark:border-slate-800 text-center space-y-4">
    <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span class="font-medium">Akun Demo Cepat:</span>
        <span class="text-[11px] opacity-75">Klik untuk mengisi</span>
    </div>

    <div class="grid grid-cols-2 gap-2 text-xs">
        <button 
            type="button" 
            onclick="fillCredentials('admin@m3s-connect.id', 'Password123!')"
            class="px-3 py-2 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/60 font-semibold hover:bg-teal-100 dark:hover:bg-teal-900/60 transition-colors text-left flex flex-col"
        >
            <span class="font-bold flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                Admin
            </span>
            <span class="text-[10px] text-slate-500 dark:text-slate-400 font-normal truncate">admin@m3s-connect.id</span>
        </button>

        <button 
            type="button" 
            onclick="fillCredentials('moderator@m3s-connect.id', 'Password123!')"
            class="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left flex flex-col"
        >
            <span class="font-bold flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                Moderator
            </span>
            <span class="text-[10px] text-slate-500 dark:text-slate-400 font-normal truncate">moderator@m3s-connect.id</span>
        </button>
    </div>

    <div class="pt-2 text-xs">
        <a 
            href="http://localhost:3000" 
            class="inline-flex items-center gap-1.5 font-medium text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
        >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Kembali ke Portal Alumni M3S
        </a>
    </div>

    <script>
        function fillCredentials(email, pass) {
            const emailInput = document.getElementById('data.email') || document.querySelector('input[type="email"]');
            const passInput = document.getElementById('data.password') || document.querySelector('input[type="password"]');
            
            if (emailInput) {
                emailInput.value = email;
                emailInput.dispatchEvent(new Event('input', { bubbles: true }));
                emailInput.dispatchEvent(new Event('change', { bubbles: true }));
            }
            if (passInput) {
                passInput.value = pass;
                passInput.dispatchEvent(new Event('input', { bubbles: true }));
                passInput.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }
    </script>
</div>
