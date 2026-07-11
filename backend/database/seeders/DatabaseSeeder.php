<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Quiz;
use App\Models\Question;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $user = User::firstOrCreate(
            ['email' => 'admin@test.com'],
            ['name' => 'Admin', 'password' => bcrypt('password')]
        );

        $quiz = Quiz::create([
            'user_id' => $user->id,
            'title' => 'Layanan Web (Web Services)',
            'pin' => '987654',
            'status' => 'active'
        ]);

        $questions = [
            [
                'quiz_id' => $quiz->id,
                'question' => 'Apa itu layanan web (web service)?',
                'option_a' => 'Aplikasi desktop',
                'option_b' => 'Sistem perangkat lunak yang dirancang untuk mendukung interaksi mesin-ke-mesin melalui jaringan',
                'option_c' => 'Peramban web',
                'option_d' => 'Bahasa pemrograman',
                'correct_answer' => 'B'
            ],
            [
                'quiz_id' => $quiz->id,
                'question' => 'Manakah yang merupakan format pertukaran data yang umum digunakan dalam web services?',
                'option_a' => 'JSON dan XML',
                'option_b' => 'DOCX dan PDF',
                'option_c' => 'EXE dan BAT',
                'option_d' => 'JPEG dan PNG',
                'correct_answer' => 'A'
            ],
            [
                'quiz_id' => $quiz->id,
                'question' => 'Apa kepanjangan dari REST?',
                'option_a' => 'Representational State Transfer',
                'option_b' => 'Remote Execution System Transfer',
                'option_c' => 'Real-time Event Streaming Transfer',
                'option_d' => 'Random Entity Service Transport',
                'correct_answer' => 'A'
            ],
            [
                'quiz_id' => $quiz->id,
                'question' => 'Protokol apa yang umumnya digunakan oleh RESTful web services?',
                'option_a' => 'FTP',
                'option_b' => 'SMTP',
                'option_c' => 'HTTP',
                'option_d' => 'SSH',
                'correct_answer' => 'C'
            ],
            [
                'quiz_id' => $quiz->id,
                'question' => 'Manakah dari berikut ini yang merupakan contoh web service SOAP?',
                'option_a' => 'Twitter API',
                'option_b' => 'WSDL based services',
                'option_c' => 'Firebase',
                'option_d' => 'GraphQL',
                'correct_answer' => 'B'
            ]
        ];

        Question::insert($questions);
    }
}
