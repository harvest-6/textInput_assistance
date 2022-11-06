((PLUGIN_ID) => {
  'use strict';

  // 設定値読み込み用変数
  const CONFIG = kintone.plugin.app.getConfig(PLUGIN_ID);
  // 設定値読み込み
  if (!CONFIG) {
    return false;
  }

  const CONFIG_DISPLAYSPACE = CONFIG.displayspace;
  const CONFIG_SOUCEFIELD = CONFIG.soucefield;
  const CONFIG_SOUCEVALUE = CONFIG.soucevalue;
  const CONFIG_ENTERFIELD = CONFIG.enterfield;

  function CreateInputassistance(event) {
    const record = event['record'];
    const displaySpace = kintone.app.record.getSpaceElement(CONFIG_DISPLAYSPACE);
    //一旦スペース内の子要素を削除
    while( displaySpace.firstChild ){
      displaySpace.removeChild( displaySpace.firstChild );
    }
    
    //入力元の設定を確認
    let souceText = ""
    if (!CONFIG_SOUCEFIELD) {
      souceText = CONFIG_SOUCEVALUE;
    } else {
      souceText = record[CONFIG_SOUCEFIELD]['value'];
    }
    if (!souceText){
      return;
    }
    
    //データを改行コードで分割して配列に格納
    const textArray = souceText.split(/\r\n|\r|\n|[,]/);

    //配列からプロパティを作成
    let aryitmes = [];
    for (let i = 0; i < textArray.length; ++i) {
      if (textArray[i]) {
        aryitmes.push ({
          label: textArray[i],
          value: textArray[i]
        });   
      }
    }
    
    //テキスト入力補助作成
    const multiChoice = new Kuc.MultiChoice({
      items: aryitmes
      });

    //テキスト入力補助を設置
    const div_element = document.createElement('div');
    div_element.className = 'hidden_box'; 
    const label_element = document.createElement('label');
    label_element.htmlFor = "label1";
    label_element.innerText = "テキスト補助";
    const input_element = document.createElement('input');
    input_element.setAttribute("type","checkbox");
    input_element.setAttribute("id","label1");
    
    const cdiv_element = document.createElement('div');
    cdiv_element.className = 'hidden_show';
    cdiv_element.appendChild(multiChoice);
    
    div_element.appendChild(label_element);
    div_element.appendChild(input_element);
    div_element.appendChild(cdiv_element);
    
    displaySpace.appendChild(div_element);
    
    multiChoice.addEventListener('change', event => {
      const value = event.detail.value;
      const r = kintone.app.record.get(); 
      const config = kintone.plugin.app.getConfig(PLUGIN_ID);
      const enterfield = config.enterfield;
      const Linefeedcode = (() => {
        //入力先フィールドが文字列複数行の場合は改行コードを設定
        if (r.record[enterfield].type == "MULTI_LINE_TEXT") {
          return '\n';
        } else {
          return '';
        }
      })();
      
      let txtValue = r.record[enterfield].value;
      //テキスト入力補助の値の選択状況を確認
      for (let i = 0; i < textArray.length; ++i) {
        //選択有無チェック
        if (value.indexOf(textArray[i]) >= 0 ) {
          //選択済の場合は、テキストボックスに値があるか確認しなければ追記
          if (!txtValue) {
            txtValue = textArray[i] + Linefeedcode;
          } else if (txtValue.indexOf(textArray[i] + Linefeedcode) == -1) {
            txtValue  += textArray[i] + Linefeedcode;
          }
        } else {
          
          //未選択の場合は、テキストボックスの値を削除
          var reg = new RegExp(textArray[i] + Linefeedcode);
          if (txtValue && txtValue.indexOf(textArray[i]) >= 0 ) {
            txtValue  = txtValue.replace(reg, '');
          }
          
        }
      }
      r.record[enterfield].value = txtValue;
    
      kintone.app.record.set(r);      

      // // var tableRecords = record.record.tbl_consulhist.value;
      // var txtValue = tableRecords[0].value[CONFIG_ENTERFIELD].value
      // //テキスト入力補助の値の選択状況を確認
      // for (let i = 0; i < textArray.length; ++i) {
      //   //選択有無チェック
      //   if (value.indexOf(textArray[i]) >= 0 ) {
      //     //選択済の場合は、テキストボックスに値があるか確認しなければ追記
      //     if (!txtValue) {
      //       txtValue = textArray[i] + '\n';
      //     } else if (txtValue.indexOf(textArray[i] + '\n') == -1) {
      //       txtValue  += textArray[i] + '\n';
      //     }
      //   } else {
          
      //     //未選択の場合は、テキストボックスの値を削除
      //     var reg = new RegExp(textArray[i] + '\n');
      //     if (txtValue && txtValue.indexOf(textArray[i]) >= 0 ) {
      //       txtValue  = txtValue.replace(reg, '');
      //     }
          
      //   }
      // }
      // tableRecords[0].value[CONFIG_ENTERFIELD].value = txtValue
    
      // kintone.app.record.set(record);
    });
   
   return event; 
  }
  

  // 登録・更新イベント(新規レコード、編集レコード、一覧上の編集レコード)
  kintone.events.on(['app.record.index.show'], (event) => {
    
    console.log("CONFIG_DISPLAYSPACE",CONFIG_DISPLAYSPACE);
    console.log("CONFIG_SOUCEFIELD",CONFIG_SOUCEFIELD);
    console.log("CONFIG_SOUCEVALUE",CONFIG_SOUCEVALUE);
    console.log("CONFIG_ENTERFIELD",CONFIG_ENTERFIELD);
    return event;
  });

  //　新規作成・編集イベント
  kintone.events.on(['app.record.edit.show','app.record.create.show'], (event) => {
    
    CreateInputassistance(event);
    
    return event;
  });

  // 変更イベント(入力元フィールド)
  kintone.events.on(['app.record.create.change.' + CONFIG_SOUCEFIELD,
    'app.record.edit.change.' + CONFIG_SOUCEFIELD
  ], (event) => {
    CreateInputassistance(event);
    
    return event;
  });


})(kintone.$PLUGIN_ID);
