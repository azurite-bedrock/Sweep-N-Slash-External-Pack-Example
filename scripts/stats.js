import { WeaponStatsSerializerV3 } from './IPC/weapon_stats.ipc';
import { IPC, PROTO } from './IPC/ipc';
import { world } from '@minecraft/server';

// https://github.com/azurite-bedrock/Sweep-N-Slash/blob/main/CROSS_COMPATIBILITY_GUIDE.md
// https://github.com/azurite-bedrock/Sweep-N-Slash/wiki/Formats

const weaponStats = [
    {
        id: 'minecraft:stick',
        attackSpeed: 1.6,
        damage: 8,
        flags: ['is_weapon', 'sweep'],
        beforeEffect: ({ mc, player, item }) => {
            function random(min, max) {
                return Math.random() * (max - min) + min;
            }
            const rgb = {
                red: random(0, 1),
                green: random(0, 1),
                blue: random(0, 1),
            };

            let map = new mc.MolangVariableMap();
            map.setFloat('variable.size', random(0.8, 1));
            map.setColorRGB('variable.color', rgb);

            return {
                sweepMap: map,
            };
        },
    },
    {
        id: 'minecraft:iron_sword',
        flags: ['disable_shield'],
        beforeEffect: () => {
            return {
                cancelDurability: true,
            };
        },
    },
];

world.afterEvents.worldInitialize.subscribe((event) => {
    IPC.send(
        'sweep-and-slash:register-weapons@3',
        PROTO.Array(WeaponStatsSerializerV3),
        weaponStats,
    );
});
