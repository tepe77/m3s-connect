<?php

namespace App\Enums;

enum UserRole: string
{
    case GUEST = 'guest';
    case ALUMNI = 'alumni';
    case MODERATOR = 'moderator';
    case ADMIN = 'admin';
}
