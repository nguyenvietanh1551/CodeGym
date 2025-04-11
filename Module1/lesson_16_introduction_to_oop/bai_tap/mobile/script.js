class Mobile {
    constructor(name, dom) {
        this.name = name;
        this.dom = dom;
        this.isOn = false;
        this.battery = 100;
        this.draft = "";
        this.inbox = [];
        this.sent = [];
        this.updateUI();
    }

    togglePower() {
        if (this.battery === 0) {
            this.log("Pin yếu. Không thể bật.");
            return;
        }
        this.isOn = !this.isOn;
        this.log(this.isOn ? "Đã bật máy." : "Đã tắt máy.");
        this.updateUI();
    }

    charge() {
        this.battery = 100;
        this.log("🔌 Đã sạc pin đầy.");
        this.updateUI();
    }

    compose(message) {
        if (!this.canUse()) return;
        this.draft = message;
        this.log(`✍️ Đã soạn: "${message}"`);
        this.useBattery();
    }

    send(receiver) {
        if (!this.canUse()) return;
        if (!this.draft) {
            this.log("Không có nội dung để gửi.");
            return;
        }
        receiver.receive(this.name, this.draft);
        this.sent.push(this.draft);
        this.log(`📤 Đã gửi tới ${receiver.name}: "${this.draft}"`);
        this.draft = "";
        this.useBattery();
        this.updateUI();
    }

    receive(from, message) {
        if (!this.canUse()) return;
        this.inbox.push(`📩 Từ ${from}: ${message}`);
        this.log(`📨 Nhận tin từ ${from}`);
        this.useBattery();
        this.updateUI();
    }

    viewInbox() {
        if (!this.canUse()) return;
        if (this.inbox.length === 0) {
            this.log("📥 Hộp thư trống.");
        } else {
            this.log("📥 Hộp thư đến:");
            this.inbox.forEach(msg => this.log(msg));
        }
        this.useBattery();
    }

    viewSent() {
        if (!this.canUse()) return;
        if (this.sent.length === 0) {
            this.log("📤 Chưa gửi tin nhắn nào.");
        } else {
            this.log("📤 Tin đã gửi:");
            this.sent.forEach(msg => this.log(msg));
        }
        this.useBattery();
    }

    useBattery() {
        if (this.battery > 0) this.battery--;
        if (this.battery === 0) {
            this.isOn = false;
            this.log("📴 Hết pin. Máy đã tắt.");
        }
        this.updateUI();
    }

    canUse() {
        if (!this.isOn) {
            this.log("⚠️ Máy đang tắt. Hãy bật lên.");
            return false;
        }
        if (this.battery === 0) {
            this.log("⚠️ Hết pin.");
            return false;
        }
        return true;
    }

    log(message) {
        const logDiv = this.dom.querySelector('.log');
        logDiv.innerHTML += `<div>${message}</div>`;
        logDiv.scrollTop = logDiv.scrollHeight;
    }

    updateUI() {
        this.dom.querySelector('.battery').textContent = this.battery;
        this.dom.querySelector('.status').textContent = this.isOn ? "Bật" : "Tắt";
        this.dom.querySelector('.draft').value = this.draft;
    }
}

// Khởi tạo 2 điện thoại
const nokia = new Mobile("Nokia", document.getElementById("nokia"));
const iphone = new Mobile("iPhone", document.getElementById("iphone"));

// Các thao tác sự kiện
function togglePower(phone) {
    phone.togglePower();
}

function charge(phone) {
    phone.charge();
}

function composeMessage(phone) {
    const text = phone.dom.querySelector(".draft").value;
    phone.compose(text);
}

function sendMessage(sender, receiver) {
    sender.send(receiver);
}

function viewInbox(phone) {
    phone.viewInbox();
}

function viewSent(phone) {
    phone.viewSent();
}
