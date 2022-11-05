jQuery.noConflict();

(($, PLUGIN_ID) => {
  'use strict';

  // プラグインIDの設定
  const KEY = PLUGIN_ID;
  const CONF = kintone.plugin.app.getConfig(KEY);

  const setDropdown = () => {
    // フィールド情報を取得し、選択ボックスに代入する
    KintoneConfigHelper.getFields().then((resp) => {
      for (let i = 0; i < resp.length; i++) {
        const $option = $('<option></option>');

        //スペースのみ場合分け
        if (resp[i].type == "SPACER") {
          $option.attr('value', resp[i].elementId);
          $option.text(resp[i].elementId); 
        } else {
          $option.attr('value', resp[i].code);
          $option.text(resp[i].label); 
        }
        $('#select_field').append($option);
      }
      // 初期値を設定する
      $('#select_field').val(CONF.field);
    }).catch((err) => {
      console.log(resop[i])
      alert(err.message);
    });
  };


  $(document).ready(() => {

    // 既に値が設定されている場合はフィールドに値を設定する
    if (CONF) {
      // チェックボックス
      $('#checkbox_vlue').prop('checked', false);
      if (CONF.check === "1") {
        $('#checkbox_vlue').prop('checked', true);
      }
      //テキストボックス
      $('#textbox_value').val(CONF.text);
      //フィールドリスト作成
      setDropdown();
    }

    // 「保存する」ボタン押下時に入力情報を設定する
    $('#plugin-submit').click(() => {
      const config = {};
      const check = $('#checkbox_vlue').prop('checked');
      const text = $('#textbox_value').val();
      const field = $('#select_field').val();
  
      //設定値を保存
      config.check = "0";
      if (check) {
        config.check = "1";
      }
      config.text = text;
      config.field = field;

      console.log(config)

      kintone.plugin.app.setConfig(config);
    });

    // 「キャンセル」ボタン押下時の処理
    $('#plugin-cancel').click(() => {
      history.back();
    });
  });

})(jQuery, kintone.$PLUGIN_ID);
