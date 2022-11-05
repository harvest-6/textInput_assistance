((PLUGIN_ID) => {
  'use strict';

  // 入力モード
  const MODE_ON = '1'; // 変更後チェック実施

  // 設定値読み込み用変数
  const CONFIG = kintone.plugin.app.getConfig(PLUGIN_ID);
  // 設定値読み込み
  if (!CONFIG) {
    return false;
  }

  const CONFIG_CHECK = CONFIG.check;
  const CONFIG_TEXT = CONFIG.text;
  const CONFIG_FIELD = CONFIG.field;

  // 登録・更新イベント(新規レコード、編集レコード、一覧上の編集レコード)
  kintone.events.on(['app.record.index.show'], (event) => {
    
    console.log("チェックボックス設定値",CONFIG_CHECK);
    console.log("テキスト設定値",CONFIG_TEXT);
    console.log("フィールド設定値",CONFIG_FIELD);

    return event;
  });


})(kintone.$PLUGIN_ID);
