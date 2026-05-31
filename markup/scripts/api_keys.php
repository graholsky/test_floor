<?php
if(isset($_POST['type']) && $_POST['type'] == 'Salesdrive'){
    echo 'm_kzXSz3JACXk0dvjx8t5oXLw8Jw223v2-bL06CauBotDw6NyV-ZwQ2TtMo7ED3vNGPwIeJzH';
}
elseif (isset($_POST['type']) && $_POST['type'] == 'dilovod'){
    $key = 'u2NH4g31n5WfYqnCz7Xb4GMRgWDKBk';
    $url = 'https://api.dilovod.ua';

    $data = $_POST['request_data'] ?? [];

    $clientName  = $data['name'] ?? 'Иван Иванов';
    $clientPhone = $data['phone'] ?? '+380502222222';
    $clientEmail = $data['email'] ?? 'qwerty@asdf.com';
    $clientRemark = $data['remark'] ?? 'Примечание, созданное автоматически';
    $clientSalesdrive = $data['salesdrive'] ?? 'salesdrive id';


    $detailsArray = [
        "phones" => [
            ["pr" => $clientPhone, "kind" => "phone"]
        ],
        "emails" => [
            ["pr" => $clientEmail, "kind" => "email"]
        ],
        "messengers" => [], "urls" => [],
        "attributes" => [
            ["pr" => $clientSalesdrive, "kind" => "other"]
        ],
        "notes" => [
            ["pr" => $clientRemark, "kind" => "text"]
        ],
        "codes" => [
            ["pr" => "", "kind" => "taxCode"],
            ["pr" => "", "kind" => "socialCode"],
            ["pr" => "", "descr" => "", "kind" => "branchCode"],
            ["pr" => "", "descr" => "", "kind" => "koatyy"],
            ["pr" => "", "descr" => "", "kind" => "kopfg"],
            ["pr" => "", "descr" => "", "kind" => "katottg"]
        ],
        "names" => [], "addresses" => [], "certificates" => [],
        "eReporting" => [
            ["kind" => "taxOffice", "regData" => ["STI_NAME" => "", "C_RAJ" => "", "C_REG" => "", "STI_EDRPOU" => "", "C_STI" => ""]]
        ],
        "otherReqs" => [
            ["pr" => $clientSalesdrive, "kind" => "text"]
        ]
    ];

    $packetData = [
        'key'     => $key,
        'version' => '0.25',
        'action'  => 'saveObject',
        'params'  => [
            'header' => [
                'id'           => 'catalogs.persons',
                'code'         => '',
                'isGroup'      => 0,
                'name'         => [
                    'uk' => $clientName,
                    'ru' => ''
                ],
                'phone'        => $clientPhone,
                'email'        => $clientEmail,
                'details'      => json_encode($detailsArray, JSON_UNESCAPED_UNICODE),
                'personType'   => '1004000000000035',
                'state'        => '1111500000000005',
                'jurisdiction' => '1118000000001001'
            ]
        ]
    ];

    $jsonString = json_encode($packetData, JSON_UNESCAPED_UNICODE);
    $postString = 'packet=' . urlencode($jsonString);

    $curl = curl_init($url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_POST, true);
    curl_setopt($curl, CURLOPT_POSTFIELDS, $postString);
    curl_setopt($curl, CURLOPT_HTTPHEADER, ['Content-Type: application/x-www-form-urlencoded']);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);

    $response = curl_exec($curl);
    curl_close($curl);
    $res = json_decode($response, true);
    if($res['result'] && $res['result'] == 'ok'){
        echo 'ok';
    }
    else{
        echo 'fail';
    }
}

exit();