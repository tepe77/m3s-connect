<?php

namespace App\Filament\Pages\Auth;

use Filament\Pages\Auth\Login as BaseLogin;
use Illuminate\Contracts\Support\Htmlable;

class Login extends BaseLogin
{
    public function getTitle(): string | Htmlable
    {
        return 'M3S Connect Admin Panel';
    }

    public function getHeading(): string | Htmlable
    {
        return 'Masuk ke Panel';
    }

    public function getSubheading(): string | Htmlable | null
    {
        return 'Akses portal administrasi dan moderasi M3S Connect';
    }
}
