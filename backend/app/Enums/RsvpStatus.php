<?php

namespace App\Enums;

enum RsvpStatus: string
{
    case REGISTERED = 'registered';
    case CANCELLED = 'cancelled';
    case ATTENDED = 'attended';
    case NO_SHOW = 'no_show';
}
