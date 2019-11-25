<?php
$token = $_POST['token'];
$type = $_POST['type'];
$limit = $_POST['limit'];
$json = file_get_contents('http://10.128.251.13/web/web_portal_be/api/transaction?offset=0&limit='.$limit.'&token='.$token.'&type='.$type); 
$data = json_decode($json,true);
$devices = $data['message'];
foreach ($devices as $device)
{
	if($type == 'chargers_and_credit'){
			echo '<tr><td>'.$device['chargers_and_credit_account_number'].'</td>';
			echo '<td>'.$device['chargers_and_credit_bill_issue_date'].'</td>';
			echo '<td>'.$device['chargers_and_credit_bill_number'].'</td>';
			echo '<td>'.$device['chargers_and_credit_service_number'].'</td>';
			echo '<td>'.$device['chargers_and_credit_occ_description'].'</td>';
			
	}
	else if($type == 'call_and_usage'){
		echo '<tr><td>'.$device['call_and_usage_account_number'].'</td>';
		echo '<td>'.$device['call_and_usage_service_number'].'</td>';
		echo '<td>'.$device['call_and_usage_called_number'].'</td>';
		echo '<td>'.$device['call_and_usage_type'].'</td>';
		echo '<td>'.$device['call_and_usage_duration'].'</td></tr>';
	}
	else if($type == 'service_and_equipment'){
		if($device['service_and_equipment_service_owner'] == ''){
			$device['service_and_equipment_service_owner'] = '--';
		}
		echo '<tr><td>'.$device['service_and_equipment_account_number'].'</td>';
		echo '<td>'.$device['service_and_equipment_service_number'].'</td>';
		echo '<td>'.$device['service_and_equipment_service_owner'].'</td>';
		echo '<td>'.$device['service_and_equipment_charge_type_description'].'</td>';
		echo '<td>'.$device['service_and_equipment_service_type'].'</td></tr>';
	}
	else if($type == 'all'){
		echo '<tr>';
		if($device['chargers_and_credit_account_number'] == ''){
			$device['chargers_and_credit_account_number'] = $device['service_and_equipment_account_number'];
		}
		if($device['chargers_and_credit_service_number']==''){
			$device['chargers_and_credit_service_number'] = $device['service_and_equipment_service_number'];
		}
		if($device['service_and_equipment_service_owner']==''){
			$device['service_and_equipment_service_owner'] = '--';
		}
		if($device['call_and_usage_type']==''){
			$device['call_and_usage_type'] = '--';
		}
		if($device['chargers_and_credit_occ_description']==''){
			$device['chargers_and_credit_occ_description'] = '--';
		}
		if($device['service_and_equipment_charge_type_description']==''){
			$device['service_and_equipment_charge_type_description'] = '--';
		}

		echo '<td>'.$device['chargers_and_credit_account_number'].'</td>';
		echo '<td>'.$device['chargers_and_credit_service_number'].'</td>';
		echo '<td>'.$device['service_and_equipment_service_owner'].'</td>';
		echo '<td>'.$device['call_and_usage_type'].'</td>';
		echo '<td>'.$device['chargers_and_credit_occ_description'].'</td>';
		echo '<td>'.$device['service_and_equipment_charge_type_description'].'</td>';
		echo '</tr>';
	}
}


?>