<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Protocol extends Model
{
    use HasFactory, HasUuids;
    protected $fillable = [
        'title',
        'content',
        'author_id',
        'tags',
        'status',
        'avg_rating',
        'discussion_count',
    ];

    protected $casts = [
        'tags' => 'array',
    ];

    public function author()
    {
        return $this->belongsTo(User::class , 'author_id');
    }

    public function threads()
    {
        return $this->hasMany(Thread::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
