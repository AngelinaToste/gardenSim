export class InventoryItem {
        constructor (name, qty, type, index) {
            this.name = name;
            this.qty = qty;
            this.type = type;
            this.isActive = false;
            this.hotbarIndex = index;
        }
        get itemName () {
            return this.name
        }
        get itemQty () {
            return this.qty
        }
        get itemActive() {
            return this.isActive
        }
        get itemType() {
            return this.type
        }
        get itemIndex () {
            return this.hotbarIndex
        }

        set itemName (name) {
            this.name = name;
        }
        set itemQty (qty) {
            this.qty = qty;
        }
        set itemActive(isActive) {
            this.isActive = isActive
        }
        set itemType(type) {
            this.type = type
        }
        set itemIndex (index) {
            this.hotbarIndex = index
        }
        
    }
