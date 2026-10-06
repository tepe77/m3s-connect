<?php

namespace App\Enums;

enum ForumThreadStatus: string
{
    case DRAFT = 'draft';
    case PUBLISHED = 'published';
    case HIDDEN = 'hidden';
    case ARCHIVED = 'archived';
}
