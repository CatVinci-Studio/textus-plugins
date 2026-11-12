// Merged into Wiki (catvinci.database): this version only says so, once.
exports.activate = function (ctx) {
  void (async () => {
    if (await ctx.storage.global.get("told")) return;
    await ctx.storage.global.set("told", true);
    const offered = await textus.commands
      .execute("textus.offerPlugin", { id: "catvinci.database" })
      .catch(() => false);
    await textus.ui.notice(textus.l10n.t(offered === true ? "done" : "merged"));
  })();
};
