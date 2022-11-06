jQuery.noConflict();

(($, PLUGIN_ID) => {
  'use strict';

  // プラグインIDの設定
  const KEY = PLUGIN_ID;
  const CONF = kintone.plugin.app.getConfig(KEY);

  const setDropdown = () => {
    // フィールド情報を取得し、選択ボックスに代入する
    KintoneConfigHelper.getFields(["SINGLE_LINE_TEXT", "MULTI_LINE_TEXT", "SPACER"]).then((resp) => {
      for (let i = 0; i < resp.length; i++) {
        const $option_space = $('<option></option>'); //スペース格納用
        const $option_souce = $('<option></option>'); //入力元格納用 
        const $option_enter = $('<option></option>'); //入力先格納用
        console.log(resp[i])
        switch (resp[i].type) {
          case "SPACER":
            $option_space.attr('value', resp[i].elementId);
            $option_space.text(resp[i].elementId);
            $('#select_spece').append($option_space);
            break;
          case "MULTI_LINE_TEXT":
            $option_enter.attr('value', resp[i].code);
            $option_enter.text(resp[i].label);
            $('#select_enter').append($option_enter);
            break;
          case "SINGLE_LINE_TEXT":
            $option_souce.attr('value', resp[i].code);
            $option_souce.text(resp[i].label);
            $option_enter.attr('value', resp[i].code);
            $option_enter.text(resp[i].label);
            $('#select_souce').append($option_souce);
            $('#select_enter').append($option_enter);
            break;
          }
        

      }
      // 初期値を設定する
      $('#select_spece').val(CONF.displayspace);
      $('#select_souce').val(CONF.soucefield);
      $('#select_enter').val(CONF.enterfield);
    }).catch((err) => {
      console.log(resop[i])
      alert(err.message);
    });
  };


  $(document).ready(() => {

    // 既に値が設定されている場合はフィールドに値を設定する
    if (CONF) {
      //テキストボックス
      $('#textbox_value').val(CONF.soucevalue);
      //フィールドリスト作成
      setDropdown();
    }

    // 「保存する」ボタン押下時に入力情報を設定する
    $('#plugin-submit').click(() => {
      const config = {};
      const displayspace = $('#select_spece').val();
      const soucefield = $('#select_souce').val();
      const soucevalue = $('#textbox_value').val();
      const enterfield = $('#select_enter').val();

      //設定値を保存
      config.displayspace = displayspace;
      config.soucefield = soucefield;
      config.soucevalue = soucevalue;
      config.enterfield = enterfield;

      console.log(config)

      kintone.plugin.app.setConfig(config);
    });

    // 「キャンセル」ボタン押下時の処理
    $('#plugin-cancel').click(() => {
      history.back();
    });
  });

})(jQuery, kintone.$PLUGIN_ID);
