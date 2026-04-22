<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\API\ResponseTrait;
use App\Models\ActivityLogModel;

class LogController extends BaseController
{
    use ResponseTrait;

    public function index()
    {
        $model = new ActivityLogModel();
        $logs = $model->getLogsWithUser();
        
        return $this->respond([
            'status' => true,
            'data'   => $logs
        ]);
    }
}
