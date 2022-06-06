<?php
if($_POST["submit"]) {
	$senderEmail=$_POST["senderEmail"];
	$message=$_POST["message"];

	$mailBody="Email: $senderEmail\n\n$message";

    mail("fordc004@googlemail.com", "Codetta: interest.", $mailBody, "From: $senderEmail");
}
?>