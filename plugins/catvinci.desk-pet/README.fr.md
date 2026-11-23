# Compagnon de bureau

Un compagnon chibi qui vous tient compagnie pendant que vous écrivez et réagit à ce que vous faites.

Affichez-la ou masquez-la avec **Extensions › Afficher ou masquer le compagnon**, ou depuis la palette de commandes. La première fois que le plugin est activé, elle apparaît d’elle-même.

- **Qui :** Moyu, la fille-chat de Textus. Pendant que Textus AI travaille et que son panneau est ouvert, la LLM-chan du modèle qu’il utilise passe vous voir : Claude-chan, GPT-chan, Gemini-chan, DeepSeek-chan, Kimi-chan, Qwen-chan, Doubao-chan, GLM-chan, MiniMax-chan, Grok-chan ou ERNIE-chan. L’invitée reste environ une minute et demie après que Textus AI a fini, et rentre chez elle quand le panneau IA se ferme. Pour garder un seul personnage, choisissez-le dans les réglages du plugin ou avec **Changer de personnage…** dans son menu du clic droit.
- **Où :** d’abord dans la fenêtre de Textus. Faites-la glisser où vous voulez ; faites un clic droit sur elle pour changer de personnage, la mettre sur votre bureau (au-dessus de toutes les fenêtres), la réduire à un point ou la fermer. Sur le bureau, son menu ouvre aussi Textus ou Textus AI. Elle réapparaît là où vous l’avez laissée et, d’un côté comme de l’autre, se tourne vers le milieu.
- **Ce qu’elle fait :** elle écrit quand vous tapez, rêvasse puis somnole quand vous vous arrêtez, se réjouit quand vous enregistrez, se penche quand Textus AI travaille, dort quand Textus est en arrière-plan. Cliquez sur elle et elle répond ; cliquez plusieurs fois pour la caresser ; emportez-la et elle sursaute. Elle vous dit bonjour une fois par jour, vous accueille après une longue pause, vous encourage après une longue période d’écriture puis vous demande de vous reposer, vous rappelle d’aller dormir tard le soir, et vous prévient quand Textus AI a des modifications à relire.
- **Ce qu’elle dit :** chaque personnage parle avec sa propre voix, avec quelques répliques au choix pour chaque moment, dans toutes les langues de Textus (`lines/`).

## Réglages

- **Qui vous tient compagnie :** suivre le modèle de Textus AI (par défaut), ou toujours le même personnage.
- **Bulles de dialogue :** désactivez-les et elle reste silencieuse.
- **Me rappeler de me reposer tard le soir :** si vous écrivez entre 23 h et 5 h, elle vous rappelle une fois dans la nuit d’aller dormir.

Elle sait seulement *qu’il* s’est passé quelque chose - vous avez tapé, enregistré, Textus AI réfléchit -, jamais un mot de vos documents ni de vos conversations : le plugin ne demande donc aucune permission.

## Crédits

Moyu est le personnage de CatVinci Studio. Les LLM-chan sont les personnages que la communauté a imaginés pour les modèles d’IA, dessinés par [ZipZipPipe](https://space.bilibili.com/4168597) et d’autres artistes, et redessinés en chibi par CatVinci Studio - voir [LLM-chan stickers](https://github.com/ChengAoShen/LLM-chan-stickers). C’est une création de fans, sans lien avec aucune entreprise d’IA.

## Changements

- **0.1.10** - Its page is in every language Textus speaks. Its description begins with what she does, and no longer counts the characters or languages. Its page receives Textus's messages by the API's current name.
- **0.1.9** - Code kept for Textus versions it no longer runs on is gone.
- **0.1.8** - What she says sits above her, two lines at most, and never covers her face.
- **0.1.7** - A visiting LLM-chan keeps her pose and greeting when a new page opens, and stays still while Textus is in the background. Her hop is gentler, and the bubble's tail points at her middle.
- **0.1.6** - The speech bubble's tail joins its box with no line between them.
- **0.1.5** - started on the left, she faces the middle from the first frame; her speech bubble is Textus's own, and when she is small its words shrink with her (to a readable floor) and wrap into even lines; needs Textus 1.3.12
- **0.1.4** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.1.3** - The model's LLM-chan visits only while the Textus AI panel is open, and goes home when it closes.
- **0.1.2** - Every character redrawn; she sits at either side and turns to face the middle.
- **0.1.1** - Moyu speaks for herself when Textus AI works ("I'm here to help"), and cheers on fluent writing.
- **0.1.0** - First version: Moyu and the LLM-chan in a floating view, in the window or on the desktop, with lines in every language Textus speaks.
