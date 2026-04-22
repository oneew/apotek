<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\API\ResponseTrait;
use App\Models\UserModel;
use Firebase\JWT\JWT;

class AuthController extends BaseController
{
    use ResponseTrait;
    protected $format = 'json';

    /**
     * POST /api/auth/login
     */
    public function login()
    {
        $rules = [
            'username' => 'required|min_length[3]',
            'password' => 'required|min_length[6]',
        ];

        if (!$this->validate($rules)) {
            return $this->respond([
                'status'  => false,
                'message' => 'Validasi gagal',
                'errors'  => $this->validator->getErrors()
            ], 400);
        }

        $userModel = new UserModel();
        $user = $userModel->where('username', $this->request->getVar('username'))->first();

        if (!$user) {
            return $this->respond([
                'status'  => false,
                'message' => 'Username tidak ditemukan'
            ], 401);
        }

        if (!password_verify($this->request->getVar('password'), $user['password'])) {
            return $this->respond([
                'status'  => false,
                'message' => 'Password salah'
            ], 401);
        }

        // Generate JWT Token
        $key = getenv('JWT_SECRET_KEY') ?: 'apotek_digital_jwt_secret_key_2026_change_this';
        $expireTime = (int)(getenv('JWT_EXPIRE_TIME') ?: 3600);
        $algorithm = getenv('JWT_ALGORITHM') ?: 'HS256';

        $payload = [
            'iss' => 'apotek-digital',
            'iat' => time(),
            'exp' => time() + $expireTime,
            'uid' => $user['id'],
            'username' => $user['username'],
            'name' => $user['name'],
            'role' => $user['role'],
        ];

        $token = JWT::encode($payload, $key, $algorithm);

        // LOGGING: Record successful login
        $this->logActivity('Authentication', 'User login: ' . $user['username'], $user['id'], ['username' => $user['username'], 'role' => $user['role']]);

        return $this->respond([
            'status'  => true,
            'message' => 'Login berhasil',
            'data'    => [
                'token' => $token,
                'user'  => [
                    'id'       => $user['id'],
                    'name'     => $user['name'],
                    'username' => $user['username'],
                    'role'     => $user['role'],
                ],
                'expires_in' => $expireTime,
            ]
        ]);
    }

    /**
     * POST /api/auth/logout
     */
    public function logout()
    {
        // LOGGING: Record logout (if user data is available via JWT filter)
        $userData = $this->request->userData ?? null;
        if ($userData) {
            $this->logActivity('Authentication', 'User logout: ' . $userData->username, $userData->uid);
        }

        return $this->respond([
            'status'  => true,
            'message' => 'Logout berhasil'
        ]);
    }

    /**
     * GET /api/auth/profile
     */
    public function profile()
    {
        $userData = $this->request->userData ?? null;

        if (!$userData) {
            return $this->respond([
                'status'  => false,
                'message' => 'User data tidak ditemukan'
            ], 401);
        }

        $userModel = new UserModel();
        $user = $userModel->find($userData->uid);

        if (!$user) {
            return $this->respond([
                'status'  => false,
                'message' => 'User tidak ditemukan'
            ], 404);
        }

        return $this->respond([
            'status' => true,
            'data'   => [
                'id'       => $user['id'],
                'name'     => $user['name'],
                'username' => $user['username'],
                'role'     => $user['role'],
            ]
        ]);
    }
}
