<?php
header('Content-Type: application/json; charset=utf-8');

$data = json_decode(file_get_contents("php://input"), true);

$name = trim($data["name"] ?? "");
$email = trim($data["email"] ?? "");
$phone = trim($data["phone"] ?? "");
$message = trim($data["message"] ?? "");

if (!$name || !$email || !$message) {
  http_response_code(400);
  echo json_encode(["success" => false, "error" => "Champs manquants"]);
  exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  echo json_encode(["success" => false, "error" => "Email invalide"]);
  exit;
}


function getEnvValue($key) {
  $value = getenv($key);
  if ($value) return trim($value);

  $envPath = dirname(__DIR__) . '/.env';
  if (!file_exists($envPath)) return '';

  $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

  foreach ($lines as $line) {
    $line = trim($line);
    if ($line === '' || str_starts_with($line, '#')) continue;

    [$envKey, $envValue] = array_pad(explode('=', $line, 2), 2, '');

    if (trim($envKey) === $key) {
      return trim($envValue, " \t\n\r\0\x0B\"'");
    }
  }

  return '';
}

$apiKey = getEnvValue('RESEND_API_KEY');

if (!$apiKey) {
  http_response_code(500);
  echo json_encode(["success" => false, "error" => "Clé Resend introuvable dans le fichier .env"]);
  exit;
}

$payload = [
  "from" => "Prévenir pour Gagner <onboarding@resend.dev>",
  "to" => ["prevenirpourgagner@yahoo.com"],
  "reply_to" => $email,
  "subject" => "Demande d'intervention - " . $name,
  "html" => "
    <h2>Nouvelle demande</h2>
    <p><strong>Nom :</strong> $name</p>
    <p><strong>Email :</strong> $email</p>
    <p><strong>Téléphone :</strong> " . ($phone ?: "Non renseigné") . "</p>
    <p><strong>Message :</strong><br>$message</p>
  "
];

$ch = curl_init("https://api.resend.com/emails");

curl_setopt_array($ch, [
  CURLOPT_POST => true,
  CURLOPT_HTTPHEADER => [
    "Authorization: Bearer $apiKey",
    "Content-Type: application/json"
  ],
  CURLOPT_POSTFIELDS => json_encode($payload),
  CURLOPT_RETURNTRANSFER => true
]);

$response = curl_exec($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($status >= 200 && $status < 300) {
  echo json_encode(["success" => true]);
} else {
  http_response_code(500);
  $decoded = json_decode($response, true);
  echo json_encode([
    "success" => false,
    "error" => $decoded["message"] ?? $decoded["error"] ?? $response,
    "status" => $status
  ]);
}