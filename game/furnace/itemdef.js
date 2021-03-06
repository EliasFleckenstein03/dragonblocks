dragonblocks.registerNode({
	name: "furnace:furnace",
	texture: "furnace_furnace.png",
	groups: ["cracky"],
	hardness: 10,
	desc: "Furnace",
	stable: true,
	onset: (x, y) => {
		let meta = dragonblocks.getNode(x, y).meta;
		meta.inventory = new furnace.Inventory();
		if(meta.inventoryString)
			meta.inventory.parse(meta.inventoryString);
	},
	onclick: (x, y) => {
		let meta = dragonblocks.getNode(x, y).meta;
		dragonblocks.player.setInventoryElements([meta.inventory, dragonblocks.player.tmp.mainInventory]);
		dragonblocks.player.openInventory();
		dragonblocks.player.onNextInventoryClose = _ => {
			dragonblocks.player.resetInventoryElements();
			meta.inventoryString = meta.inventory.stringify();
		};
	},
	ondig: (x, y) => {
		return dragonblocks.getNode(x, y).meta.inventory.isEmpty();
	},
});
for(let i = 0; i < 6; i++){
	dragonblocks.registerItem({
		name: "furnace:burn_progress_" + i,
		texture: "furnace_burn_progress_" + i + ".png",
		groups: [],
		hidden: true,
		desc: "",
	});
	dragonblocks.registerItem({
		name: "furnace:fuel_progress_" + i,
		texture: "furnace_fuel_progress_" + i + ".png",
		groups: [],
		hidden: true,
		desc: "",
	});
}
