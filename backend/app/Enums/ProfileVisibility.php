<?php

namespace App\Enums;

enum ProfileVisibility: string
{
    case PUBLIC = 'public';
    case MEMBERS = 'members';
    case PRIVATE = 'private';
}
