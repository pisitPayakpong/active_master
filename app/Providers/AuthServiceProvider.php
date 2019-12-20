<?php

namespace App\Providers;

use App\Services\Auth\JwtGuard;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use App\Library\JwtLibrary;
use Firebase\JWT\JWT;
use App\Models\User;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        'App\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any application authentication / authorization services.
     *
     * @return void
     */
    public function boot(Request $request)
    {
        $this->registerPolicies();

        Auth::viaRequest('api', function ($request) {
            if (empty($token = $request->bearerToken())) {
                return null;
            }

            $credentials = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $userId = $credentials->sub;
            return $userId;
        });
    }
}
