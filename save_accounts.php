<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
	exit(0);
}

$accounts_file = 'accounts.json';

function loadAccounts() {
	global $accounts_file;
	if (file_exists($accounts_file)) {
		$json = file_get_contents($accounts_file);
		return json_decode($json, true) ?: [];
	}
	return [];
}

function saveAccounts($accounts) {
	global $accounts_file;
	return file_put_contents($accounts_file, json_encode($accounts, JSON_PRETTY_PRINT));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	$input = json_decode(file_get_contents('php://input'), true);
	if (!$input || !isset($input['email'])) {
		http_response_code(400);
		echo json_encode(['error' => 'Invalid input']);
		exit;
	}
	
	$accounts = loadAccounts();
	
	// Check if account already exists
	$exists = false;
	foreach ($accounts as &$account) {
		if ($account['email'] === $input['email']) {
			// Update existing account
			$account = array_merge($account, $input);
			$account['last_login'] = date('Y-m-d H:i:s');
			$exists = true;
			break;
		}
	}
	
	if (!$exists) {
		// Add new account
		$input['created_at'] = date('Y-m-d H:i:s');
		$input['last_login'] = date('Y-m-d H:i:s');
		$accounts[] = $input;
	}
	
	if (saveAccounts($accounts)) {
		echo json_encode(['success' => true, 'message' => 'Account saved successfully']);
	} else {
		http_response_code(500);
		echo json_encode(['error' => 'Failed to save account']);
	}
	
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
	// Return all accounts (for debugging - remove in production)
	$accounts = loadAccounts();
	echo json_encode($accounts);
} else {
	http_response_code(405);
	echo json_encode(['error' => 'Method not allowed']);
}
?>