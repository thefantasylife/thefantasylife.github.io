const Aya = {
     Attack_Power: 28
    ,Attack_Power_Growth: 2.6
    ,Health: 480
    ,Health_Growth: 63
    ,Health_Regen: 0.5
    ,Health_Regen_Growth: 0.05
    ,Stamina: 440
    ,Stamina_Growth: 22
    ,Stamina_Regen: 2.3
    ,Stamina_Regen_Growth: 0.07
    ,Defense: 14
    ,Defense_Growth: 1.4
    ,Atk_Speed: 0.12
    ,Crit_Rate: 0
    ,Move_Speed: 3.0
    ,Sight_Range: 8
    ,Attack_Range: 0.4
    ,weapons: [Pistol, AssaultRifle, SniperRifle]
    ,correction: {
        Pistol: [
            [0, -15, -11],
            [0, 0, 0]
        ],
        AssaultRifle: [
            [0, -12, -13],
            [0, 0, 0]
        ],
        SniperRifle: [
            [0, -15, -15],
            [-3, 0, 0]
        ]
    }
    ,Base_Attack: (character, enemy) => {
        if (character.weapon) {
            if (character.weapon.Type === 'AssaultRifle') {
                const damage1 = baseAttackDamage(character, enemy, 0, 0.32, character.critical_strike_chance, 1);
                const damage2 = baseAttackDamage(character, enemy, 0, 0.48, character.critical_strike_chance, 1);
                const min1 = baseAttackDamage(character, enemy, 0, 0.32, 0, 1);
                const min2 = baseAttackDamage(character, enemy, 0, 0.48, 0, 1);
                const max1 = baseAttackDamage(character, enemy, 0, 0.32, 100, 1);
                const max2 = baseAttackDamage(character, enemy, 0, 0.48, 100, 1);
                return "<b class='damage'>" + (damage1 + damage1 + damage2) + '</b> ( ' + min1 + ', ' + min1 + ', ' + min2 + ' - ' + max1 + ', ' + max1 + ', ' + max2 + ' )';
            }
            const damage = baseAttackDamage(character, enemy, 0, 1, character.critical_strike_chance, 1);
            const min = baseAttackDamage(character, enemy, 0, 1, 0, 1);
            const max = baseAttackDamage(character, enemy, 0, 1, 100, 1);
            return "<b class='damage'>" + damage + '</b> ( ' +  min + ' - ' + max + ' )';
        }
        return '-';
    }
    ,Base_Attack_Option: ''
    ,DPS: (character, enemy) => {
        if (character.weapon) {
            let as, shot;
            if (character.weapon.Type === 'AssaultRifle') {
                as = 10 / (9.5 / character.attack_speed + 2);
                shot = baseAttackDamage(character, enemy, 0, 0.32, character.critical_strike_chance, 1) * 2 + 
                    baseAttackDamage(character, enemy, 0, 0.48, character.critical_strike_chance, 1);
            } else {
                as = character.weapon.Ammo / ((character.weapon.Ammo - 1) / character.attack_speed + 2);
                shot = baseAttackDamage(character, enemy, 0, 1, character.critical_strike_chance, 1);
            }
            const damage1 = round(shot * as * 100) / 100;
            const damage2 = round(shot * character.attack_speed * 100) / 100;
            const life1 = calcHeal(shot * (character.life_steal / 100), as, enemy);
            const life2 = calcHeal(shot * (character.life_steal / 100), character.attack_speed, enemy);
            return "<b class='damage'>" + damage1 + '</b> - ' + damage2 + "<b> __h/s: </b><b class='heal'>" + life1 + '</b> - ' + life2;
        }
        return '-';
    }
    ,DPS_Option: ''
    ,HPS: (character, enemy) => {
        return "<b class='heal'>" + calcHeal(character.hp_regen * (character.hp_regen_percent + 100) / 100 + 
            (character.food ? character.food.HP_Regen / 30 : 0), 2, enemy) + '</b>';
    }
    ,Q_Skill: (character, enemy) => {
        if (character.weapon) {
            const q = character.Q_LEVEL.selectedIndex;
            const damage1 = calcSkillDamage(character, enemy, 0, 1, 1);
            const damage2 = calcSkillDamage(character, enemy, 20 + q * 40, 0.5, 1);
            const cool = 10000 / ((7 - q * 0.5) * (100 - character.cooldown_reduction));
            return "<b class='damage'>" + (damage1 + damage2) + '</b> ( ' + damage1 + ', ' + damage2 + " )<b> __sd/s: </b><b class='damage'>" + round((damage1 + damage2) * cool) / 100 + '</b>';
        }
        return '-';
    }
    ,Q_Option: ''
    ,W_Skill: (character, enemy) => {
        if (character.weapon) {
            const w = character.W_LEVEL.selectedIndex;
            const damage = calcSkillDamage(character, enemy, 22 + w * 22, 0.3 + w * 0.05, 1);
            const cool = 10000 / ((18 - w * 1.5) * (100 - character.cooldown_reduction) + 317);
            return "<b class='damage'>" + damage * 10 + '</b> ( ' + damage + " x 10 )<b> __sd/s: </b><b class='damage'>" + round(damage * 10 * cool) / 100 + '</b>';
        }
        return '-';
    }
    ,W_Option: ''
    ,E_Skill: (character, enemy) => {
        return '-';
    }
    ,E_Option: ''
    ,R_Skill: (character, enemy) => {
        if (character.weapon) {
            const r = character.R_LEVEL.selectedIndex;
            const min = calcSkillDamage(character, enemy, 200 + r * 100, 0.7, 1);
            const max = calcSkillDamage(character, enemy, 400 + r * 200, 1.4, 1);
            return "<b class='damage'>" + min + ' ~ ' + max + "</b>";
        }
        return '-';
    }
    ,R_Option: ''
    ,D_Skill: (character, enemy) => {
        const wm = character.WEAPON_MASTERY.selectedIndex;
        if (character.weapon && wm > 5) {
            const type = character.weapon.Type;
            if (type === 'Pistol') {
                return '-';
            }
            if (type === 'AssaultRifle') {
                const as2 = calcAttackSpeed(character, wm < 13 ? 40 : 60);
                const as1 = 10 / (9.5 / as2 + 2);
                const shot = baseAttackDamage(character, enemy, 0, 0.32, character.critical_strike_chance, 1) * 2 + 
                    baseAttackDamage(character, enemy, 0, 0.48, character.critical_strike_chance, 1);
                const damage1 = round(shot * as1 * 100) / 100;
                const damage2 = round(shot * as2 * 100) / 100;
                const life1 = calcHeal(shot * (character.life_steal / 100), as1, enemy);
                const life2 = calcHeal(shot * (character.life_steal / 100), as2, enemy);
                const shield = 100 + character.T_LEVEL.selectedIndex * 50 + character.attack_power * 0.3 | 0;
                return "<b> _d/s: </b><b class='damage'>" + damage1 + '</b> - ' + damage2 + "<b> __h/s: </b><b class='heal'>" + life1 + '</b> - ' + life2 + 
                    "<b> __s/s: </b><b class='shield'>" + (shield * (1 + as1 * 6) / 0.3 | 0) / 100 + '</b> - ' + (shield * (1 + as2 * 6) / 0.3 | 0) / 100;
            }
            if (type === 'SniperRifle') {
                const damage = calcSkillDamage(character, enemy, 0, wm < 13 ? 2.5 : 3, 1);
                return "<b class='damage'>" + damage + ' ~ ' + damage * 3 + '</b> ( ' + damage + ' x 3 )';
            }
        }
        return '-';
    }
    ,D_Option: (character, enemy) => {
        return '';
    }
    ,T_Skill: (character, enemy) => {
        if (character.weapon) {
            const shield = 100 + character.T_LEVEL.selectedIndex * 50 + character.attack_power * 0.3 | 0;
            let as;
            if (character.weapon.Type === 'AssaultRifle') {
                as = 10 / (9.5 / character.attack_speed + 2) * 6;
            } else {
                as = character.weapon.Ammo / ((character.weapon.Ammo - 1) / character.attack_speed + 2) * 2;
            }
            return "<b> _s: </b><b class='shield'>" + shield + "</b><b> __s/s: </b><b class='shield'>" + (shield * (1 + as) / 0.3 | 0) / 100 + '</b>';
        }
        return '-';
    }
    ,T_Option: ''
    ,Help: (character) => {
        if (!character.character) {
            return 'select character plz';
        }
        if (!character.weapon) {
            return 'select weapon plz';
        }
        const weapon = character.weapon.Type;
        const type = 
            weapon === 'Pistol' ? '권총' : 
            weapon === 'AssaultRifle' ? '돌격소총' : 
            weapon === 'SniperRifle' ? '저격총' : 
            '';
        const skill = 
            weapon === 'Pistol' ? '"데미지 없음"' : 
            weapon === 'AssaultRifle' ? '_d/s: "초당 데미지" - "장전 배제 데미지" __h/s: "초당 흡혈량" - "장전 배제 흡혈량" __s/s: "초당 쉴드량" - "장전 배제 쉴드량"' : 
            weapon === 'SniperRifle' ? '"1발당 데미지"' : 
            '';
        return '아야 ( ' + type + ' )\n' + 
            'A: "평균 데미지" ( "최소 데미지" - "치명타 데미지" )\n' + 
            'DPS: "초당 데미지" __h/s: "초당 흡혈량"\n' + 
            'HPS: "초당 회복량"\n' + 
            'Q: "합산 데미지" ( "1타 데미지", "2타 데미지" )\n' + 
            'W: "합산 데미지" ( "1발당 데미지" x "타수" )\n' + 
            'E: "데미지 없음"\n' + 
            'R: "최소 데미지" ~ "최대 데미지"\n' + 
            'D: ' + skill + '\n' + 
            'T: _s: "쉴드량" __s/s: "초당 쉴드량"\n';
    }
    ,COMBO: (character, enemy) => {
        if (character.weapon) {
            const type = character.weapon.Type;
            const q = character.Q_LEVEL.selectedIndex;
            const w = character.W_LEVEL.selectedIndex;
            const r = character.R_LEVEL.selectedIndex;
            const wm = character.WEAPON_MASTERY.selectedIndex;
            let damage = 0, c;
            const combo = character.COMBO_OPTION.value;
            for (let i = 0; i < combo.length; i++) {
                c = combo.charAt(i);
                if (c === 'a') {
                    if (type === 'AssaultRifle') {
                        damage += baseAttackDamage(character, enemy, 0, 0.32, 0, 1) * 2;
                        damage += baseAttackDamage(character, enemy, 0, 0.48, 0, 1);
                    } else {
                        damage += baseAttackDamage(character, enemy, 0, 1, 0, 1);
                    }
                } else if (c === 'A') {
                    if (type === 'AssaultRifle') {
                        damage += baseAttackDamage(character, enemy, 0, 0.32, 100, 1) * 2;
                        damage += baseAttackDamage(character, enemy, 0, 0.48, 100, 1);
                    } else {
                        damage += baseAttackDamage(character, enemy, 0, 1, 100, 1);
                    }
                } else if (c === 'q' || c === 'Q') {
                    damage += calcSkillDamage(character, enemy, 0, 1, 1) + calcSkillDamage(character, enemy, 20 + q * 40, 0.5, 1);
                } else if (c === 'w') {
                    damage += calcSkillDamage(character, enemy, 22 + w * 22, 0.3 + w * 0.05, 1) * 5;
                } else if (c === 'W') {
                    damage += calcSkillDamage(character, enemy, 22 + w * 22, 0.3 + w * 0.05, 1) * 10;
                } else if (c === 'r') {
                    damage += calcSkillDamage(character, enemy, 200 + r * 100, 0.7, 1);
                } else if (c === 'R') {
                    damage += calcSkillDamage(character, enemy, 400 + r * 200, 1.4, 1);
                } else if (c === 'd' || c === 'D') {
                    if (wm > 5) {
                        if (type === 'SniperRifle') {
                            damage += calcSkillDamage(character, enemy, 0, wm < 13 ? 2.5 : 3, 1);
                        }
                    }
                } else if (c === 'p' || c === 'P') {
                    if (character.trap) {
                        damage += character.trap.Trap_Damage * (1.04 + character.TRAP_MASTERY.selectedIndex * 0.04) | 0;
                    }
                }
            }
            const heal = enemy.hp_regen ? calcHeal(enemy.hp_regen * (enemy.hp_regen_percent + 100) / 100 + 
                (enemy.food ? enemy.food.HP_Regen / 30 : 0), 2, character) : 0;
            const percent = (enemy.max_hp ? ((damage - character.DIV.querySelector('.combo_time').value * heal) / enemy.max_hp  * 10000 | 0) / 100 : '-');
            return "<b class='damage'>" + damage + '</b><b> _ : ' + (percent < 0 ? 0 : percent) + '%</b>';
        }
        return '-';
    }
    ,COMBO_Option: 'aqrwaaaq'
    ,COMBO_Help: (character) => {
        if (!character.character) {
            return 'select character plz';
        }
        if (!character.weapon) {
            return 'select weapon plz';
        }
        const weapon = character.weapon.Type;
        const d = 
            weapon === 'Pistol' ? 'd & D: 데미지 없음\n' : 
            weapon === 'AssaultRifle' ? 'd & D: 데미지 없음\n' : 
            weapon === 'SniperRifle' ? 'd & D: 무스 1회 데미지\n' : 
            '';
        return 'a: 기본공격 데미지\n' + 
            'A: 치명타 데미지\n' +
            'q & Q: Q스킬 데미지\n' + 
            'w: W스킬 1.5초간 데미지\n' + 
            'W: W스킬 3초간 데미지\n' + 
            'e & E: 데미지 없음\n' + 
            'r: R스킬 즉발 데미지\n' + 
            'R: R스킬 최대 데미지\n' + 
            't & T: 데미지 없음\n' + 
            d + 
            'p & P: 트랩 데미지';
    }
};
