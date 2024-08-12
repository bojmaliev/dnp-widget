 (async function () {

        const URL = 'https://api.dnp.mk/api/v1/products/public'
        const PRODUCTS_TO_SHOW = 4

        const shuffleArray = (array) => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                const temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
            return array
        }

        const getProducts = () => {
            return fetch(URL).then(a => a.json())
        }

        const flatProducts = (products) => {
            return products.data
                .reduce((acc, item) => [...item.variants.map(b => ({
                    ...b,
                    product: item.name
                })), ...acc], [])
                .filter(a => a.image_src)
        }

        const mapToHtml = (item) => {
            return `<div style="display:flex; position: relative; flex-direction: column; line-height:normal; ">
    <img src="${item.image_src}" alt="" style=" width:100%; aspect-ratio: 1/1; border-radius: 0.5rem; object-fit: cover;"  />

    <div style="font-weight: bold; margin-top:5px; ">${item.product} - ${item.type} - ${item.size}</div>
    <div style="margin-top:2px;">${item.price} ден.</div>
    <a target="_blank" href="https://dnp.mk/products/${item.slug}" style="position:absolute; inset:0;"></a>
</div>`
        }


        const products = await getProducts()
        const flatten = flatProducts(products)
        shuffleArray(flatten)

        const spliced = flatten.splice(0, PRODUCTS_TO_SHOW)

        const html = spliced.map(a => mapToHtml(a)).join('')

        const dnp = document.getElementById('dnp')
        dnp.style.fontSize = '0.8rem'


        const productsNode = document.createElement('div')

        productsNode.innerHTML = html
        productsNode.style.display = 'grid'
        productsNode.style.gap = '0.5rem'
        productsNode.style.maxWidth = '100%'
        productsNode.classList.add('prod-count')


        const style = document.createElement('style');
        style.innerHTML = `
                .prod-count{
                grid-template-columns: minmax(0, 1fr);
            }
        @media only screen and (min-width : 992px) {
            .prod-count{
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                }
            }
            `;

        dnp.prepend(style)
        dnp.prepend(productsNode)
    })();
