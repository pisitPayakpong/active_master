<?php

namespace App\Library;

use Firebase\JWT\JWT;

class JwtLibrary
{
    public static function jwt($user)
    {
        $payload = [
          'iss' => "lumen-jwt", // Issuer of the token
          'sub' => $user->id, // Subject of the token
          'iat' => time(), // Time when JWT was issued.
        //   'exp' => time() + env('JWT_EXPIRE_HOUR') * 60 * 60 , // Expiration time
      ];
        return JWT::encode($payload, env('JWT_SECRET'));
    }
}
