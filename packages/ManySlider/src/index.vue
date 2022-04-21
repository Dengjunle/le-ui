<template>
    <div ref="leslider" class="le-slider__runway">
        <!-- 间断点 -->
        <template v-if="showStops">
            <div v-for="(item) in stopArr" :key="item.id" :style="{left:`${item.left}%`}" class="le-slider_stops" ></div>
        </template>
        <template v-for="(item,index) in list">
            <div :key="item.id">
                <!-- 进度条 -->
                <div :ref="`le-slider__bar${index}`" class="le-slider__bar" :style="barStyle[index]"></div>
                <!-- 圆点滑块 -->
                <div
                class="le-slider__button-wrapper"
                :style="wrapperStyle[index]"
                @touchstart="(e)=>onButtonDown(e,index)"
                @mousedown="(e)=>onButtonDown(e,index)"
                >
                    <div class="le-slider__button" :style="{borderColor:wrapperStyle[index].borderColor}"></div>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
export default {
    name: 'LeManySlider',
    model: {
        prop: 'list',
        event: 'input'
    },
    props: {
        // 数据
        list: {
            type: Array,
            default: () => {
                return [
                    {
                        id: new Date().getTime() + parseInt(Math.random() * 1000), // id值
                        value: 0, // 宽度百分比
                        diffPrivate: 0, // 总宽度占比位置
                        color: 'red'//点及左边进度的颜色
                    },
                    {
                        id: new Date().getTime() + parseInt(Math.random() * 1000), // id值
                        value: 100, // 宽度百分比
                        diffPrivate: 100, // 总宽度占比位置
                        color: 'green'//点及左边进度的颜色
                    }
                ]// 多个滑块数组对象，默认一个
            }
        },
        // 颜色的切换数组从左到右
        colorList: {
            type: Array,
            default: () => ['red','green']
        },
        // 间断点个数
        stopNum: {
            type: Number,
            default: 0
        },
        // 显示间断点
        showStops: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            current: 0, // 当前滑动的索引
            marginLeft: 0,
            stopArr:[],//间断点的数组数据
        }
    },
    watch:{
        stopNum:{
            handler(newValue,oldValue){
                //计算新的间断点的间距百分比
                let newStop = newValue?100/(newValue):0;
                //计算旧的间断点的间距百分比
                let oldStop = oldValue?100/(oldValue):0;
                // 计算新的间断点数组
                let stopArr = Array.from({length:newValue-1}).map((item,index)=>{
                    return {
                        id:Date.now() + parseInt(Math.random()*10000),
                        left:Math.round((index+1)*newStop)
                    }
                })
                this.stopArr = stopArr;
                // 存在旧间断点数组就进行适配新的间断点数据
                if(oldValue){
                    let arr = [];//临时存储滑块数据数组
                    let list = JSON.parse(JSON.stringify(this.list));
                    list.forEach((item,index)=>{
                        if(item.diffPrivate===0){
                            arr.push(item);
                        }else{
                            // 计算占领多少间断点
                            // 判断临时滑块最右边的的占比是否已经超过99了||判断当前点未最后一个点
                            if(arr[arr.length-1].diffPrivate>99||index+1>=list.length){
                                return;
                            }
                            // 计算旧数据原本占领多少个间断点个数
                            let num = Math.round(item.value/oldStop);
                            num = num===0?1:num;//至少占领1个
                            // 计算当前点的位置处于新间断点数组的第indexx索引
                            let indexx = Math.round((newStop*num + arr[arr.length-1].diffPrivate)/newStop) - 1;
                            // 计算当前点占领总长的百分比取决于间断点（适配性更好）
                            item.diffPrivate = indexx>=stopArr.length?100:stopArr[indexx].left;
                            // 用间断点数组的数据来计算占比（适配性更好）
                            item.value = Math.round(item.diffPrivate - arr[arr.length-1].diffPrivate);
                            // 当超出100百分比的情况兼容
                            if(newStop*num + arr[arr.length-1].diffPrivate>100){
                                item.value = Math.round(100 - arr[arr.length-1].diffPrivate);
                                item.diffPrivate = 100;
                            }
                            arr.push(item);
                        }
                    })
                    // 不满100百分比的情况
                    if(arr[arr.length-1].diffPrivate<99){
                        arr.push({
                            id: new Date().getTime() + parseInt(Math.random() * 1000),
                            value: 100 - arr[arr.length-1].diffPrivate, // 宽度百分比
                            diffPrivate: 100, // 总宽度占比位置
                            color: this.setRightColor(arr)
                        })
                    }
                    // 通知更新滑块数据
                    this.$emit("input",arr)
                }
            },
            immediate:true
        }
    },
    computed: {
        // 按钮的位置样式
        wrapperStyle() {
            let list = this.list;
            return list.map((item) => {
                return {
                    left: item.diffPrivate + '%',
                    borderColor: item.color
                }
            })
        },
        // 进度条样式
        barStyle() {
            let list = this.list;
            return list.map((item) => {
                return {
                    width: `${item.value}%`,// 进度条占比宽度
                    left: `${item.diffPrivate - item.value}%`,// 进度条距离左侧的百分比
                    backgroundColor: item.color
                }
            })
        }
    },
    mounted() {
        this.marginLeft = this.$refs.leslider.getBoundingClientRect().left;
        this.init();
    },
    methods: {
        // 初始化
        init() {
            let list = this.list;
            // 最左边的初始值
            let startData = {
                id: new Date().getTime() + parseInt(Math.random() * 1000), // id值
                value: 0, // 宽度百分比
                diffPrivate: 0, // 总宽度占比位置
                color: this.colorList[0]
            };
            // 最右边的初始值
            let endData = {
                id: new Date().getTime() + parseInt(Math.random() * 1000), // id值
                value: 100, // 宽度百分比
                diffPrivate: 100, // 总宽度占比位置
                color: this.colorList[this.colorList.length - 1]
            };
            if (list.length === 0) {
                list.push(startData,endData)
                this.$emit('input', list)
            }
            if (list[0].value > 0) {
                list.unshift({
                    id: new Date().getTime() + parseInt(Math.random() * 1000),
                    value: 0, // 宽度百分比
                    diffPrivate: 0, // 总宽度占比位置
                    color: this.setLeftColor()
                })
                this.$emit('input', list)
            }
            if (list[list.length - 1].diffPrivate < 100) {
                list.push({
                    id: new Date().getTime() + parseInt(Math.random() * 1000),
                    value: 100 - list[list.length - 1].diffPrivate, // 宽度百分比
                    diffPrivate: 100, // 总宽度占比位置
                    color: this.setRightColor()
                })
                this.$emit('input', list)
            }
        },
        // 开始点击 准备拖动
        onButtonDown(e, index) {
            // 阻止默认的点击事件执行
            e.preventDefault();
            this.current = index;// 当前滑动的索引值
            // this.onDragStart(e);
            window.addEventListener('mousemove', this.onDragging);
            window.addEventListener('touchmove', this.onDragging);
            window.addEventListener('mouseup', this.onDragEnd);
            window.addEventListener('touchend', this.onDragEnd);
        },
        // // 记录首次的位置
        // onDragStart(e){
        //     // 记录点击开始的x位置
        // },
        // 移动中
        onDragging(e) {
            let list = this.list;
            // 如果从左侧拉出一个点，就从左侧生成一个新的初始点
            if (list[0].value > 0) {
                list.unshift({
                    id: new Date().getTime() + parseInt(Math.random() * 1000),
                    value: 0, // 宽度百分比
                    diffPrivate: 0,
                    color: this.setLeftColor()
                })
                this.current = 1;
                this.$emit('input', list);
            }
            // 如果从右侧拉出一个点，就从右侧生成一个新的结束点
            if (list[list.length - 1].diffPrivate < 100) {
                list.push({
                    id: new Date().getTime() + parseInt(Math.random() * 1000),
                    value: 100 - list[list.length - 1].diffPrivate, // 宽度百分比
                    diffPrivate: 100,
                    color: this.setRightColor()
                })
                this.$emit('input', list);
            }
            // 兼容touchmove
            if (e.type === 'touchmove') {
                e.clientX = e.touches[0].clientY;
                e.clientY = e.touches[0].clientY;
            }
            // 总长度
            let W = this.$refs['leslider'].clientWidth;
            // 计算当前位置占比总长的百分比
            let diffPrivate = Math.round((e.clientX - this.marginLeft) / W * 100);
            // 设置位置
            this.setPosition(diffPrivate);
        },
        // 移除移动中事件
        onDragEnd() {
            window.removeEventListener('mousemove', this.onDragging);
            window.removeEventListener('touchmove', this.onDragging);
            window.removeEventListener('mouseup', this.onDragEnd);
            window.removeEventListener('touchend', this.onDragEnd);
        },
        // 刻度尺间断模式下滑块应该到达的位置
        getStopPercentageIndex(diffPrivate){
            let {list,current,stopArr} = this;
            // 计算当前点左边的点的位置
            let left = current-1;
            left = left<0?0:list[left].diffPrivate;
            // 计算当前点右边的点的位置
            let right = current+1;
            right = right>=list.length?100:list[right].diffPrivate;
            // 判断当前移动位置是否超出了左右点的位置，超出了就返回null
            if(diffPrivate<left||diffPrivate>right)return null;
            // 当移动位置超出100%就只停留在右边初始点的位置
            if(diffPrivate>=100)return 100;
            // 当移动位置超出了负数停留在左边初始点的位置
            if(diffPrivate<=0)return 0;
            // 计算当前移动位置靠近哪个间断点的索引（偏大值）
            let index = stopArr.findIndex((item)=>(item.left>diffPrivate));
            if(index===0){
                // index为0代表处于左边初始位置到第一个间断点的这段距离
                return 0;
            }else if(index===-1&&diffPrivate<100){
                // index为-1代表处于最后一个间断点到右边初始位置的这段距离
                index = stopArr.length - 1;
            }else{
                // 处于间断点内
                index -= 1;
            }
            // 判断应该滑动到的间断点是否符合在当前点左右两点之间
            if(stopArr[index].left>left&&stopArr[index].left<right){
                return stopArr[index].left;
            }else{
                return null;
            }
        },
        // 设置位置
        setPosition(diffPrivate) {
            if (diffPrivate === null || isNaN(diffPrivate)) return;
            if (diffPrivate < 0) {
                diffPrivate = 0;
            } else if (diffPrivate > 100) {
                diffPrivate = 100;
            }
            if(this.showStops){
                diffPrivate = this.getStopPercentageIndex(diffPrivate);
                if(diffPrivate===null)return;
            }
            let {list,current} = this;
            // 当前点右边点的位置
            let diffNext = list[current + 1] ? list[current + 1].diffPrivate : null;
            // 当前点左边点的位置
            let diffPreviou = list[current - 1] ? list[current - 1].diffPrivate : null;
            // 当左边的点超过右边的点就进行固定在右边的点位置
            if (diffPrivate >= diffNext && diffNext !== null)diffPrivate = diffNext;
            // 当右边的点超过左边的点就进行固定在左边的点位置
            if (diffPrivate <= diffPreviou && diffPreviou !== null)diffPrivate = diffPreviou;
            // 左边第二个拖到最左侧 进行 删除第一项
            if (diffPrivate === 0 && diffPreviou !== null) { 
                // this.onDragEnd(); 
                this.current = 0; 
                list.shift(); 
            }
            // 右边第二个拖到最右侧 进行 删除最后一项
            if (diffPrivate === 100 && diffNext !== null) { 
                // this.onDragEnd(); 
                list.pop(); 
            }

            // 计算当前移动拖条占比宽
            let value = this.getValue((diffPrivate - diffPreviou));
            list[this.current].value = value;// 宽度百分比
            list[this.current].diffPrivate = diffPrivate;// 赋值当前位置的占总长度的比例

            if(this.current !== this.list.length - 1){
                // 其他滑动点 改变右边的滑条长度
                let item = list[this.current + 1];
                item.value = this.getValue(item.diffPrivate - diffPrivate);
            }
            this.$emit('input', list)
        },
        // 计算宽度百分比
        getValue(newPosition) {
            if (newPosition < 0) {
                newPosition = 0;
            } else if (newPosition > 100) {
                newPosition = 100;
            }
            return Math.round(newPosition)
        },
        // 设置右边新的颜色
        setRightColor(list=this.list) {
            let colorList = this.colorList;// 颜色数组
            if(colorList.length===1)return colorList[0];//只有一种颜色的情况
            let length = list.length;// 当前数据滑块点的个数
            let endColorIndex = colorList.indexOf(list[length - 1].color);// 最后一个点颜色在颜色数组中的位置
            let setIndex = 0;
            if (endColorIndex >= 0 && endColorIndex < (colorList.length - 1)) {
                setIndex = endColorIndex + 1;
            } else if (endColorIndex === (colorList.length - 1)) {
                setIndex = 0;
            }
            return colorList[setIndex];
        },
        // 设置左边新的颜色
        setLeftColor(list=this.list) {
            let colorList = this.colorList;// 颜色数组
            if(colorList.length===1)return colorList[0];//只有一种颜色的情况
            let firstColorIndex = colorList.indexOf(list[0].color);// 第一个点颜色再颜色数组中的位置
            let setIndex = 0;
            if (firstColorIndex === 0) {
                setIndex = colorList.length - 1;
            } else if (firstColorIndex > 0 && firstColorIndex <= (colorList.length - 1)) {
                setIndex = firstColorIndex - 1;
            }
            return colorList[setIndex];
        }
    }
}
</script>

<style>
.le-slider__runway{
    width: 100%;
    height: 6px;
    margin: 16px 0;
    background-color: #E4E7ED;
    border-radius: 3px;
    position: relative;
    cursor: pointer;
    vertical-align: middle;
}
.le-slider__bar{
    height: 6px;
    background-color: #409EFF;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
    position: absolute;
}
.le-slider__button-wrapper{
    width: 36px;
    height: 36px;
    z-index: 1001;
    top: -14px;
    transform: translateX(-50%);
    background-color: transparent;
    text-align: center;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
}
.le-slider__button{
    display:inline-block;
    vertical-align: middle;
    width: 16px;
    height: 16px;
    border: 2px solid #409EFF;
    background-color: #FFF;
    border-radius: 50%;
    transition: .2s;
}
.le-slider__button:hover{
    transform: scale(1.2);
    cursor: grab;
}
.le-slider__button:active{
    cursor: grabbing;
}
.le-slider_stops{
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 6px;
    height: 6px;
    border-radius: 6px;
    background-color: #FFF;
    z-index: 1;
}
</style>