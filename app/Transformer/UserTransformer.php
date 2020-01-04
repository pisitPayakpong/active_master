<?php

namespace App\Transformer;

use League\Fractal\TransformerAbstract;
use App\Models\User;

class UserTransformer extends TransformerAbstract
{
    /**
      * Transform a User model into an array
      *
      * @param User $user
      * @return array
      */

    public function transform(User $user)
    {
        return [
          'id'    => $user->id,
          'name'  => $user->name,
          'email' => $user->email,
          'role'  => $user->role,
          'address'  => $user->address,
          'province'  => $user->province,
          'tel'   => $user->tel,
          'image' => $user->image
        ];
    }
}
