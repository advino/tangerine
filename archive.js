
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
            <nav>
                <a href="/">Index</a>
                <a href="#about">Info</a> 
             </nav>
            <div class="header-block">

                <h1 class="header"> Tangerine Library </h1>
                <p class="subheader">
                    An online bookcase
                </p>
            </div>
            <div class="title-block item">

                ${
                    state.filters.map(f => {
                        return html `
                            <span class="item-el" style="text-transform: capitalize;" onclick="${ () => { emit('setFilter', f)} }" > ${f} </span>
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
                                    <span class="item-el" >${ item.name }</span>
                                    <span class="item-el" >${ item.type }</span>
                                </div>
                                <div class="detail ${state.current == item.name ? 'current' : ''}">
                                    <div class="image-container">
                                        <img class="item-image" src="../styles/assets/${item.id}.png">
                                    </div>
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
        <nav>
            <a href="/">Index</a>
            <a href="#about">Info</a> 
        </nav>
        <div style="display: flex; flex-direction: column; width: 100%; padding: 12px; padding-top: 48px; gap: 12px; color: #ff5200;">

            <span class="subheader">
                ① Tangerine Library is an ongoing curation of books and publications. This list is updated on a regular basis.
            </span>
            <span style="width: 75%;" class="subheader">
                ② The library is built on choo.js and is set in <a href="https://pangrampangram.com/products/editorial-new">Editorial New by PangramPangram</a> and <a href="https://rsms.me/inter/">Inter by rsms</a>.
            </span>
            <span style="width: 75%;" class="subheader">
                ③ A tangerine. Opened and ready to share.
            </span>

            <img style="width: 240px; height: auto;" src="../styles/assets/tangerine.png">

        </div>
    </body>
    `
}
