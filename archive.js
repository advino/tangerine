
const { db, ref, onValue } = require('./fb');

let html = require('choo/html');
let choo = require('choo');

let app = choo({hash: true});
app.use(state);
app.route('/', home);
app.route('#about', about);


app.mount('body');

function state(state, emitter) {

    state.lib = [];
    state.filter = "name";
    state.filters = ["name", "type"];
    state.current = "";

    emitter.on('DOMContentLoaded', () => {

        console.log('Ready');
        const lb = ref(db, 'library1f8SIZzLIUHHU4zalsyRlpBH4yaltL_8JOTCDwcD_2bw/Home');
        onValue(lb, (snapshot) => {
            const data = snapshot.val();

            let mpped = data.sort((a,b) => {
                return a[state.filter].localeCompare(b[state.filter]);
            });

            state.lib = mpped;
            console.log(state.filters);
            emitter.emit('render');
        })


        emitter.on('setFilter', data => {

            state.filter = data;

            let mapped = state.lib.sort((a,b) => {
                return a[state.filter].localeCompare(b[state.filter]);
            })

            state.lib = mapped;

            emitter.emit('render');
        });

        emitter.on('selectItem', data => {

            if(state.current == data) {
                state.current = ""
            } else {
                state.current = data;
            }
            emitter.emit('render');
        })
    });


}

function home(state, emit) {
    return html `
        <body>

            <div class="header-block">
                <h1 class="header"> TANGERINE LIBRARY </h1>
                <p class="subheader">A collection of books, magazines, and zines. <a class="subheader" href="#about">Read More</a></p>
            </div>
            <div class="title-block" style="display: flex; justify-content: flex-start; width: 100%;">

                ${
                    state.filters.map(f => {
                        return html `
                            <span onclick="${ () => { emit('setFilter', f)} }" style="display: block; width: 25%;"> ${f} </span>
                        `
                    })
                }
            </div>
            <div style="display: flex; flex-direction: column; width: 100%; font-family: Inter; color: #ff5200;">
                
                ${
                    state.lib.map(item => {
                        return html `
                            <div onclick="${ () => { emit('selectItem', item.name) } }" class="item-block">
                                <div class="item">
                                    <span style="display: block; width: 25%; height: 100%;">${ item.name }</span>
                                    <span style="display: block; width: 25%; height: 100%;">${ item.type }</span>
                                </div>
                                <div class="detail ${state.current == item.name ? 'current' : ''}">
                                    <img class="item-image" src="">
                                    <span class="description">
                                        ${ item.about }
                                    </span>
                                </div>
                            </div>
                        `
                    })
                }
            </div>
        </body>
    `
}

function about(state, emit) {
    return html`
    <body>
        <div style="display: flex; flex-direction: column; width: 25%; padding: 8px; gap: 12px;">
            <a class="subheader" href ="/">
                Go back
            </a>

            <span class="subheader">
                Tangerine Library is a set of books, magazines, and zines I've collected over the last 6 years. I update the list regularly with new finds. Tangerines are great fruits to share, the books in this library are too!
            </span>

            <span class="subheader">
                The library is built on choo.js and is set in Editorial New by PangramPangram and Inter by rsms.
            </span>
        </div>
    </body>
    `
}
