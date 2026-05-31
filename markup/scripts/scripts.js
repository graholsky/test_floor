(function ($) {
    $(document).ready(function () {
        $('a').each(function (e) {
            if ($(this).attr('href') == '#') {
                $(this).addClass('empty-link');
            }
        });

        $('.mob-menu.burger').click(function () {
            $('.mob-menu.burger').hide();
            $('.mob-menu.close').show();
            $('.menu-wrap').addClass('visible');
            $('.menu-wrap').slideToggle(1000);
        });

        $('.mob-menu.close').click(function () {
            $('.mob-menu.burger').show();
            $('.mob-menu.close').hide();
            $('.menu-wrap').slideToggle(1000);
            setTimeout(function () {
                $('.menu-wrap').removeClass('visible');
            }, 1000);
        });

        $("#phone").inputmask({"mask": "+380-99-99-99-999"});

        $('.name input').keydown(function (e) {
            var regx = /^[a-zA-Zа-яА-ЯёЁіІєЄїЇ]$/;
            if (e.key && !e.key.match(regx) && e.key !== 'Backspace' && e.key !== 'Delete') {
                e.preventDefault();
            }
        });

        $('.form-button-wrap a').click(function (e) {
            e.preventDefault();
            $('.error-msg').hide();
            var form = $('.form form')
            var data = {
                first_name: $(form).find('#first_name').val(),
                last_name: $(form).find('#last_name').val(),
                email: $(form).find('#email').val(),
                phone: $(form).find('#phone').val(),
                message: $(form).find('#message').val(),
                for_bot: $(form).find('.for-bot').val()
            };

            if (validate(data)) {
                setSalesdriveData(data);
            }
        });

        function validate(data) {
            if (data.for_bot.length == 0) {
                $.each(data, function (key,val){
                    if(key !== 'for_bot' && val.length == 0){
                        $('.error-msg').show();
                        return false;
                    }
                });
                return true;
            } else {
                return false;
            }
        }

        function setSalesdriveData(data) {
            $.ajax({
                url: "/scripts/api_keys.php",
                type: "post",
                data: {'type': 'Salesdrive'},
                success: function (key) {
                    var request_data = {
                        "getResultData": 1,
                        "lName": data.last_name,
                        "fName": data.first_name,
                        "phone": data.phone,
                        "email": data.email,
                        "comment": data.message,
                    }
                    $.ajax({
                        url: "https://test-work.salesdrive.me/handler/",
                        type: "post",
                        dataType: "json",
                        headers: {'X-Api-Key': key},
                        data: request_data,
                        success: function (response) {
                            if (response.success) {
                                $('.form form').trigger('reset');
                                if (response.data.orderId) {
                                    request_data.order_id = response.data.orderId
                                }
                                setDilovodClient(request_data);
                                alert('Done');
                            } else {
                                telegramError('salesdrive',data);
                            }
                        }
                    });
                }
            });
        }

        function setDilovodClient(data) {

            if(!data.order_id){
                data.order_id = '111';
            }

            var user_data = {
                    "name": data.fName + ' ' + data.lName,
                    "remark": data.comment,
                    "email": data.email,
                    "phone": data.phone,
                    "salesdrive": 'Salesdrive ID - ' + data.order_id,
            };


            $.ajax({
                url: "/scripts/api_keys.php",
                type: "post",
                data: {
                    'type': 'dilovod',
                    'request_data': user_data,
                },
                success: function (res) {
                    if(res !== 'ok'){
                        telegramError('dilovod',data)
                    }
                }
            });
        }

        function telegramError(from, data) {
            console.log('telegramError2');
            const token = '8760121985:AAHC-ZujV88hJEkvD7XhNH-c3Lqn4e0Ekz0';
            const chatId = '-1003811179001';
            var message = 'error ' + from + ' ';

            $.each(data, function(index, value) {
                if(index !== 'for_bot' && index !== 'for_bot'){
                    message += value + ' ';
                }
            });

            $.ajax({
                url: `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`,
                method: 'POST',
                data: {
                    chat_id: chatId,
                    text: message
                },
                success: function(res) {
                    console.log(res);
                },

            });
        }

    });
})(jQuery);
