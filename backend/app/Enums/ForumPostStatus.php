<?php

namespace App\Enums;

enum ForumPostStatus: string
{
    case PUBLISHED = 'published';
    case HIDDEN = 'hidden';
    case DELETED = 'deleted';
}
