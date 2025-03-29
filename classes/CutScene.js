export class CutScene {
    constructor({ game, step, launch, finish, load }) {
        //
        // this.game = game ?? null;
        this.step = step ?? null;

        this.load = load ?? null;
        this.launch = launch ?? null;
        this.finish = finish ?? null;


    }

    sceneStep() {
        console.log('step scener');
    }

}

