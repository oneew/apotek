<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;

class JwtAuthFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $header = $request->getHeaderLine('Authorization');

        if (empty($header)) {
            return service('response')
                ->setStatusCode(ResponseInterface::HTTP_UNAUTHORIZED)
                ->setJSON([
                    'status' => false,
                    'message' => 'Token tidak ditemukan'
                ]);
        }

        $token = null;
        if (preg_match('/Bearer\s(\S+)/', $header, $matches)) {
            $token = $matches[1];
        }

        if (is_null($token)) {
            return service('response')
                ->setStatusCode(ResponseInterface::HTTP_UNAUTHORIZED)
                ->setJSON([
                    'status' => false,
                    'message' => 'Format token tidak valid'
                ]);
        }

        try {
            $key = getenv('JWT_SECRET_KEY') ?: 'apotek_digital_jwt_secret_key_2026_change_this';
            $algorithm = getenv('JWT_ALGORITHM') ?: 'HS256';
            $decoded = JWT::decode($token, new Key($key, $algorithm));
            
            // Store user data in request for controllers to access
            $request->userData = $decoded;
            
        } catch (ExpiredException $e) {
            return service('response')
                ->setStatusCode(ResponseInterface::HTTP_UNAUTHORIZED)
                ->setJSON([
                    'status' => false,
                    'message' => 'Token sudah kadaluarsa'
                ]);
        } catch (\Exception $e) {
            return service('response')
                ->setStatusCode(ResponseInterface::HTTP_UNAUTHORIZED)
                ->setJSON([
                    'status' => false,
                    'message' => 'Token tidak valid: ' . $e->getMessage()
                ]);
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // No action needed
    }
}
