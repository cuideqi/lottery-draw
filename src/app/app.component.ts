import { Component, ViewChild, ElementRef, AfterViewInit, Renderer2, OnInit } from '@angular/core';
import { CacheService, FIRST_PRIZE_LIST, SECOND_PRIZE_LIST, THIRD_PRIZE_LIST, TOTAL_USER_LIST } from './cache.service';
import { NzModalService } from 'ng-zorro-antd';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

  totalUserList = [
    '郑思林', '仲伟伦', '祝伟健', '谢关明', '崔德奇', '瞿佳利', '徐攀召', '刘书琳', '刘玲玲', '朱文瑄',
    '李莹', '杨云飞', '蒋文悦', '李梦梦', '薛葭葭', '瞿海英', '谢雨欣', '刘露迎', '保住田野', '周福菊',
    '田沐云', '王婷', '冯璟彧', '程浩', '陈贞健', '田勇', '罗成坚'
  ];

  userList = [];

  config = {
    outsideRadius: 330, // 转盘外圆的半径
    insideRadius: 68,
    startAngel: Math.PI / 2 // 绘图开始角度
  };

  randomAngel = 0; // 随机角度

  firstPrizeNum = 1; // 一等奖个数
  secondPrizeNum = 3; // 二等奖个数
  thirdPrizeNum = 6; // 三等奖个数

  firstPrizeList = []; // 一等奖人员名单
  secondPrizeList = []; // 二等奖人员名单
  thirdPrizeList = []; // 三等奖人员名单

  isRotating = false; // 转盘是否在旋转

  whichPrizeIsDoing = 0; // 决定抽哪个等级的奖励
  @ViewChild('canvas', undefined) canvas: ElementRef;
  @ViewChild('music', undefined) music: ElementRef;
  constructor(private render: Renderer2, private cacheService: CacheService, private messsage: NzModalService) {
    console.log(this.totalUserList.length);
  }

  ngOnInit() {
    this.userList = JSON.parse(this.cacheService.getKey(TOTAL_USER_LIST)) || this.totalUserList;
    this.firstPrizeList = JSON.parse(this.cacheService.getKey(FIRST_PRIZE_LIST)) || [];
    this.secondPrizeList = JSON.parse(this.cacheService.getKey(SECOND_PRIZE_LIST)) || [];
    this.thirdPrizeList = JSON.parse(this.cacheService.getKey(THIRD_PRIZE_LIST)) || [];
  }


  ngAfterViewInit() {
    this.drawLottery();
  }

  rotate() {
    if (this.firstPrizeList.length === this.firstPrizeNum
       && this.secondPrizeList.length === this.secondPrizeNum
       && this.thirdPrizeList.length === this.thirdPrizeNum) {
      this.setMessage('抽奖已经结束！');
      return;
    }
    if (this.whichPrizeIsDoing === 0) {
      this.setMessage('请先选择抽奖等级！');
      return;
    }
    if (this.whichPrizeIsDoing === 3 && this.thirdPrizeList.length >= this.thirdPrizeNum) {
      this.setMessage('三等奖已经抽完，请选择其他等级抽奖！');
      return;
    } else if (this.whichPrizeIsDoing === 2 && this.secondPrizeList.length >= this.secondPrizeNum) {
      this.setMessage('二等奖已经抽完，请选择其他等级抽奖！');
      return;
    } else if (this.whichPrizeIsDoing === 1 && this.firstPrizeList.length >= this.firstPrizeNum) {
      this.setMessage('一等奖已经抽完，请选择其他等级抽奖！');
      return;
    }
    this.drawLottery();

    const audio = this.music.nativeElement as HTMLAudioElement;
    const canvas = this.canvas.nativeElement as HTMLCanvasElement;
    const randomAngel = Math.random() * 3 * 360; // 随机角度，抽奖关键
    this.randomAngel = randomAngel;
    if (this.isRotating) {
      this.isRotating = false;
      this.render.removeClass(canvas, 'roting');
      this.render.setStyle(this.canvas.nativeElement, 'transform', `rotate(${randomAngel}deg)`);
      this.getPrizeName();
      audio.pause();
    } else {
      this.isRotating = true;
      audio.play();
      this.render.addClass(canvas, 'roting');
    }
  }

  getPrizeName() {
    const rotateRad = this.randomAngel % 360 * Math.PI / 180; // 旋转的弧度
    const singleAngel = Math.PI * 2 / this.userList.length; // 每个分割的弧度
    const rotateRadNum = Math.floor(rotateRad / singleAngel);
    const prizeName = this.userList[this.userList.length - rotateRadNum - 1];
    if (prizeName) {
      if (!this.isNotPrizeName(prizeName)) {
        if (this.whichPrizeIsDoing === 3 && this.thirdPrizeList.length < this.thirdPrizeNum) {
          this.thirdPrizeList.push(prizeName);
          this.cacheService.setKey(THIRD_PRIZE_LIST, JSON.stringify(this.thirdPrizeList));
        } else if (this.whichPrizeIsDoing === 2 && this.secondPrizeList.length < this.secondPrizeNum) {
          this.secondPrizeList.push(prizeName);
          this.cacheService.setKey(SECOND_PRIZE_LIST, JSON.stringify(this.secondPrizeList));
        } else if (this.whichPrizeIsDoing === 1 && this.firstPrizeList.length < this.firstPrizeNum) {
          this.firstPrizeList.push(prizeName);
          this.cacheService.setKey(FIRST_PRIZE_LIST, JSON.stringify(this.firstPrizeList));
        } else {
          return;
        }
      }
      this.userList = this.userList.filter(user => user !== prizeName);
      this.cacheService.setKey(TOTAL_USER_LIST, JSON.stringify(this.userList));
      console.log(this.userList);
      setTimeout(() => {
        this.setMessage(`${prizeName}`);
      }, 100);
    }
  }

  private drawLottery() {

    const canvas = this.canvas.nativeElement as HTMLCanvasElement;
    const canvasHeight = canvas.height;
    const canvasWidth = canvas.width;
    const baseAngle = Math.PI * 2 / this.userList.length;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.strokeStyle = '#FFF';
    ctx.font = '16px Microsoft YaHei';
    this.userList.forEach((user: string, index: number) => {
      const angle = -this.config.startAngel + index * baseAngle;
      ctx.fillStyle = 'rgb(178, 10, 10)';
      ctx.beginPath();
      ctx.arc(canvasWidth * 0.5, canvasHeight * 0.5, this.config.outsideRadius, angle, angle + baseAngle, false);
      ctx.arc(canvasWidth * 0.5, canvasHeight * 0.5, this.config.insideRadius, angle + baseAngle, angle, true);
      ctx.stroke();
      ctx.fill();
      ctx.save(); // 保存状态

      // 重置画笔，画用户名
      ctx.fillStyle = '#fff';
      const translateX = canvasWidth * 0.5;
      const translateY = canvasHeight * 0.5;
      ctx.translate(translateX , translateY);
      ctx.rotate(angle + baseAngle / 2);
      ctx.fillText(user, 200, 0);
      ctx.restore();
    });
  }

  // 决定抽哪类奖
  doWhichPrize(type: number): void {
    this.whichPrizeIsDoing = type;
  }

  private setMessage(info: string): void {
    this.messsage.warning({
      nzWidth: '650',
      nzIconType: null,
      nzContent: info,
      nzMask: false,
      nzStyle: {
        color: 'black'
      }
    });
  }

  isNotPrizeName(name: string) {
    const noPrizeName = ['程浩', '陈贞健', '田勇', '罗成坚'];
    return noPrizeName.includes(name);
  }
}
