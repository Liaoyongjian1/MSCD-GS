class BeforeAfter {
    constructor(enteryObject) {

        const beforeAfterContainer = document.querySelector(enteryObject.id);
        const before = beforeAfterContainer.querySelector('.bal-before');
        const beforeText = beforeAfterContainer.querySelector('.bal-beforePosition');
        const afterText = beforeAfterContainer.querySelector('.bal-afterPosition');
        const handle = beforeAfterContainer.querySelector('.bal-handle');
        var widthChange = 0;

        beforeAfterContainer.querySelector('.bal-before-inset').setAttribute("style", "width: " + beforeAfterContainer.offsetWidth + "px;")
        window.addEventListener('resize', function () {
            beforeAfterContainer.querySelector('.bal-before-inset').setAttribute("style", "width: " + beforeAfterContainer.offsetWidth + "px;")
        });
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
        console.log("初始化TripleComparison (丄形状单滑块):", entryObject.id);

        this.container = document.querySelector(entryObject.id);
        if (!this.container) {
            console.error('Container not found:', entryObject.id);
            return;
        }

        // 三个图像层
        this.gtLayer = this.container.querySelector('.bal-gt');         // GT (底层)
        this.oursLayer = this.container.querySelector('.bal-ours');     // Ours (中间层)
        this.bardgsLayer = this.container.querySelector('.bal-bardgs'); // BarDGS (顶层)

        // 丄形状滑块
        this.handle = this.container.querySelector('.bal-handle-shape');

        if (!this.gtLayer || !this.oursLayer || !this.bardgsLayer || !this.handle) {
            console.error('Required elements not found in:', entryObject.id);
            return;
        }

        // 滑块位置状态
        this.xPosition = 50; // 水平位置 (0-100)
        this.yPosition = 50; // 垂直位置 (0-100)

        this.init();
        this.addEventListeners();
    }

    init() {
        console.log("TripleComparison init called");

        // 设置初始inset宽度
        const gtInset = this.container.querySelector('.bal-gt-inset');
        const oursInset = this.container.querySelector('.bal-ours-inset');
        const bardgsInset = this.container.querySelector('.bal-bardgs-inset');

        if (gtInset) {
            gtInset.style.width = this.container.offsetWidth + 'px';
        }
        if (oursInset) {
            oursInset.style.width = this.container.offsetWidth + 'px';
        }
        if (bardgsInset) {
            bardgsInset.style.width = this.container.offsetWidth + 'px';
        }

        // 设置初始状态：显示所有图像，但通过clip-path控制显示区域
        this.gtLayer.style.display = 'block';
        this.oursLayer.style.display = 'block';
        this.bardgsLayer.style.display = 'block';

        // 设置滑块初始位置在中心
        this.xPosition = 50;
        this.yPosition = 50;
        this.handle.style.left = this.xPosition + '%';
        this.handle.style.top = this.yPosition + '%';

        // 强制重新计算布局
        setTimeout(() => {
            this.updateLayout();
        }, 100);
    }

    addEventListeners() {
        // 鼠标移动事件
        this.container.addEventListener('mousemove', (e) => {
            const rect = this.container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            this.xPosition = Math.max(0, Math.min(100, (x / this.container.offsetWidth) * 100));
            this.yPosition = Math.max(0, Math.min(100, (y / this.container.offsetHeight) * 100));

            this.updateSlider();
            this.updateLayout();
        });

        // 触摸事件
        this.container.addEventListener('touchstart', (e) => {
            const rect = this.container.getBoundingClientRect();
            const x = e.touches[0].clientX - rect.left;
            const y = e.touches[0].clientY - rect.top;

            this.xPosition = Math.max(0, Math.min(100, (x / this.container.offsetWidth) * 100));
            this.yPosition = Math.max(0, Math.min(100, (y / this.container.offsetHeight) * 100));

            this.updateSlider();
            this.updateLayout();
        });

        this.container.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const rect = this.container.getBoundingClientRect();
            const x = e.touches[0].clientX - rect.left;
            const y = e.touches[0].clientY - rect.top;

            this.xPosition = Math.max(0, Math.min(100, (x / this.container.offsetWidth) * 100));
            this.yPosition = Math.max(0, Math.min(100, (y / this.container.offsetHeight) * 100));

            this.updateSlider();
            this.updateLayout();
        });

        // 窗口大小调整
        window.addEventListener('resize', () => {
            const gtInset = this.container.querySelector('.bal-gt-inset');
            const oursInset = this.container.querySelector('.bal-ours-inset');
            const bardgsInset = this.container.querySelector('.bal-bardgs-inset');

            if (gtInset) {
                gtInset.style.width = this.container.offsetWidth + 'px';
            }
            if (oursInset) {
                oursInset.style.width = this.container.offsetWidth + 'px';
            }
            if (bardgsInset) {
                bardgsInset.style.width = this.container.offsetWidth + 'px';
            }
            this.updateSlider();
            this.updateLayout();
        });
    }

    updateSlider() {
        // 更新滑块位置
        this.handle.style.left = this.xPosition + '%';
        this.handle.style.top = this.yPosition + '%';

        // 更新滑块条的位置
        const xPixels = this.container.offsetWidth * this.xPosition / 100;
        const yPixels = this.container.offsetHeight * this.yPosition / 100;

        const horizontalBar = this.handle.querySelector('.handle-horizontal-bar');
        const verticalBar = this.handle.querySelector('.handle-vertical-bar');

        if (horizontalBar) {
            horizontalBar.style.top = yPixels + 'px';
        }
        if (verticalBar) {
            verticalBar.style.left = xPixels + 'px';
        }
    }

    updateLayout() {
        console.log("updateLayout called with x:", this.xPosition, "y:", this.yPosition);

        const xPercent = this.xPosition;
        const yPercent = this.yPosition;

        // 创建L形显示区域：十字形分割
        // 左侧区域显示GT和Ours（根据上下位置）
        // 右侧区域显示BarDGS
        const splitX = xPercent;

        if (yPercent < 50) {
            // 上半部分：GT在左上，BarDGS在右侧
            this.gtLayer.style.clipPath = `polygon(0 0, ${splitX}% 0, ${splitX}% 100%, 0 100%)`;
            this.oursLayer.style.display = 'none';
            this.bardgsLayer.style.clipPath = `polygon(${splitX}% 0, 100% 0, 100% 100%, ${splitX}% 100%)`;
        } else {
            // 下半部分：Ours在左下，BarDGS在右侧
            this.gtLayer.style.display = 'none';
            this.oursLayer.style.clipPath = `polygon(0 0, ${splitX}% 0, ${splitX}% 100%, 0 100%)`;
            this.bardgsLayer.style.clipPath = `polygon(${splitX}% 0, 100% 0, 100% 100%, ${splitX}% 100%)`;
        }

        // 确保所有图像都在正确的层级
        this.gtLayer.style.zIndex = '10';
        this.oursLayer.style.zIndex = '11';
        this.bardgsLayer.style.zIndex = '12';

        // 更新标签显示
        this.updateLabels();
    }

    updateLabels() {
        const gtLabel = this.gtLayer.querySelector('.bal-gtPosition');
        const oursLabel = this.oursLayer.querySelector('.bal-oursPosition');
        const bardgsLabel = this.bardgsLayer.querySelector('.bal-bardgsPosition');

        // 隐藏所有标签
        if (gtLabel) gtLabel.style.display = 'none';
        if (oursLabel) oursLabel.style.display = 'none';
        if (bardgsLabel) bardgsLabel.style.display = 'none';

        // 根据区域显示对应的标签
        if (this.yPosition < 50 && gtLabel) {
            // GT区域
            gtLabel.style.display = 'block';
        } else if (this.yPosition >= 50 && oursLabel) {
            // Ours区域
            oursLabel.style.display = 'block';
        }

        // BarDGS标签始终显示
        if (bardgsLabel) {
            bardgsLabel.style.display = 'block';
        }
    }
}
