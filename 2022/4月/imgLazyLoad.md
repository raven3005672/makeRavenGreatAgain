```js
// getBoundingClientRect lazy Load
let imgList1 = [...document.querySelectorAll(".get_bounding_rect")]
let num = imgList1.length

let lazyLoad1 = (function () {
    let count = 0
    return function () {
        let deleteIndexList = []
        imgList1.forEach((img,index) => {
            let rect = img.getBoundingClientRect()
            if (rect.top < window.innerHeight) {
                img.src = img.dataset.src
                // Add the image to the remove list after loading successfully
                deleteIndexList.push(index)
                count++
                if (count === num) {
                    //Unbind the Scroll event when all images are loaded
                    document.removeEventListener('scroll',lazyLoad1)
                }
            }
        })
        // Delete images that have been loaded
        imgList1 = imgList1.filter((_,index)=>!deleteIndexList.includes(index))

    }
})()

// The throttling function of throttle.js is referenced here
lazyLoad1 = proxy(lazyLoad1, 100)

document.addEventListener('scroll', lazyLoad1)
// Manually load the image once. Otherwise, the image on the first screen cannot be loaded without triggering scrolling
lazyLoad1()



// intersectionObserver lazy Load
let imgList2 = [...document.querySelectorAll(".intersection_observer")]

let lazyLoad2 = function () {
    // instantiation observer
    let observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.intersectionRatio > 0) {
                entry.target.src = entry.target.dataset.src
                observer.unobserve(entry.target)
            }
        })
    })
    imgList2.forEach(img => {
        observer.observe(img)
    })
}

lazyLoad2()
```