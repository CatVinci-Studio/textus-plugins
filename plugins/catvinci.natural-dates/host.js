// Merged into Quick Insert (catvinci.quick-insert): this version only says so, once.
exports.activate = function (ctx) {
  void (async () => {
    if (await ctx.storage.global.get("told")) return;
    await ctx.storage.global.set("told", true);
    const offered = await textus.commands
      .execute("textus.offerPlugin", { id: "catvinci.quick-insert", reason: textus.l10n.t("merged") })
      .catch(() => false);
    if (offered !== true) await textus.ui.notice(textus.l10n.t("merged"));
  })();
};
