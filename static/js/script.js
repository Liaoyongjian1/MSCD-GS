class BeforeAfter {
    constructor(enteryObject) {

        const beforeAfterContainer = document.querySelector(enteryObject.id);
        const before = beforeAfterContainer.querySelector('.bal-before');
        const beforeText = beforeAfterContainer.querySelector('.bal-beforePosition');
        const afterText = beforeAfterContainer.querySelector('.bal-afterPosition');
        const handle = beforeAfterContainer.querySelector('.bal-handle');
        var widthChange = 0;

        beforeAfterContainer.querySelector('.bal-before-inset').setAttribute("style", "width: " + beforeAfterContainer.offsetWidth + "px;")
        window.onresize = function () {
            beforeAfterContainer.querySelector('.bal-before-inset').setAttribute("style", "width: " + beforeAfterContainer.offsetWidth + "px;")
        }
        before.setAttribute('style', "width: 50%;");
        handle.setAttribute('style', "left: 50%;");

        //touch screen event listener
        beforeAfterContainer.addEventListener("touchstart", (e) => {

            beforeAfterContainer.addEventListener("touchmove", (e2) => {
                let containerWidth = beforeAfterContainer.offsetWidth;
                let currentPoint = e2.changedTouches[0].clientX;

                let startOfDiv = beforeAfterContainer.offsetLeft;

                let modifiedCurrentPoint = currentPoint - startOfDiv;

                if (modifiedCurrentPoint > 10 && modifiedCurrentPoint < beforeAfterContainer.offsetWidth - 10) {
                    let newWidth = modifiedCurrentPoint * 100 / containerWidth;

                    before.setAttribute('style', "width:" + newWidth + "%;");
                    afterText.setAttribute('style', "z-index: 1;");
                    handle.setAttribute('style', "left:" + newWidth + "%;");
                }
            });
        });

        //mouse move event listener
        beforeAfterContainer.addEventListener('mousemove', (e) => {
            let containerWidth = beforeAfterContainer.offsetWidth;
            widthChange = e.offsetX;
            let newWidth = widthChange * 100 / containerWidth;

            if (e.offsetX > 10 && e.offsetX < beforeAfterContainer.offsetWidth - 10) {
                before.setAttribute('style', "width:" + newWidth + "%;");
                afterText.setAttribute('style', "z-index:" + "1;");
                handle.setAttribute('style', "left:" + newWidth + "%;");
            }
        })

    }
}

class TripleComparison {
    constructor(entryObject) {
        console.log("初始化TripleComparison (单滑块三区域):", entryObject.id);

        this.container = document.querySelector(entryObject.id);
        if (!this.container) {
            console.error('Container not found:', entryObject.id);
            return;
        }

        this.before = this.container.querySelector('.bal-before');  // BarDGS (左上区域)
        this.right = this.container.querySelector('.bal-right');   // Ours (右下区域)
        this.after = this.container.querySelector('.bal-after');   // GT (背景)
        this.handle = this.container.querySelector('.bal-handle-shape');

        if (!this.before || !this.right || !this.after || !this.handle) {
            console.error('Required elements not found in:', entryObject.id);
            return;
        }

        this.isDragging = false;
        this.position = 50; // 滑块位置 (0-100)

        this.init();
        this.addEventListeners();
    }

    init() {
        // 设置初始inset宽度
        const beforeInset = this.container.querySelector('.bal-before-inset');
        const rightInset = this.container.querySelector('.bal-right-inset');
        if (beforeInset) {
            beforeInset.style.width = this.container.offsetWidth + 'px';
        }
        if (rightInset) {
            rightInset.style.width = this.container.offsetWidth + 'px';
        }

        this.updateLayout();
    }

    addEventListeners() {
        // 鼠标事件
        this.container.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.updateSlider(e);
        });

        document.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                this.updateSlider(e);
            }
        });

        document.addEventListener('mouseup', () => {
            this.isDragging = false;
        });

        // 触摸事件
        this.container.addEventListener('touchstart', (e) => {
            this.isDragging = true;
            this.updateSlider(e.touches[0]);
        });

        document.addEventListener('touchmove', (e) => {
            if (this.isDragging) {
                e.preventDefault();
                this.updateSlider(e.touches[0]);
            }
        });

        document.addEventListener('touchend', () => {
            this.isDragging = false;
        });

        // 窗口大小调整
        window.addEventListener('resize', () => {
            const beforeInset = this.container.querySelector('.bal-before-inset');
            const rightInset = this.container.querySelector('.bal-right-inset');
            if (beforeInset) {
                beforeInset.style.width = this.container.offsetWidth + 'px';
            }
            if (rightInset) {
                rightInset.style.width = this.container.offsetWidth + 'px';
            }
        });
    }

    updateSlider(e) {
        const rect = this.container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // 根据鼠标位置计算新的滑块位置
        // 这个位置同时控制水平和垂直分割
        this.position = Math.max(10, Math.min(90, (x / this.container.offsetWidth) * 100));

        this.updateLayout();
    }

    updateLayout() {
        const pos = this.position;

        // 更新BarDGS区域 (左上)
        // 显示在滑块左侧和滑块以上的区域
        this.before.style.left = '0%';
        this.before.style.top = '0%';
        this.before.style.width = pos + '%';
        this.before.style.height = pos + '%';

        // 更新Ours区域 (右下)
        // 显示在滑块右侧和滑块以下的区域
        this.right.style.left = pos + '%';
        this.right.style.top = pos + '%';
        this.right.style.width = (100 - pos) + '%';
        this.right.style.height = (100 - pos) + '%';

        // 更新滑块位置
        this.handle.style.left = pos + '%';
        this.handle.style.top = pos + '%';
    }
}
