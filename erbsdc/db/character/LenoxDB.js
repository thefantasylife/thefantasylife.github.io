const Lenox = {
     Attack_Power: 36
    ,Attack_Power_Growth: 2.8
    ,Health: 550
    ,Health_Growth: 75
    ,Health_Regen: 0.8
    ,Health_Regen_Growth: 0.05
    ,Stamina: 430
    ,Stamina_Growth: 13
    ,Stamina_Regen: 2.2
    ,Stamina_Regen_Growth: 0.06
    ,Defense: 28
    ,Defense_Growth: 2
    ,Atk_Speed: 0.22
    ,Crit_Rate: 0
    ,Move_Speed: 3.1
    ,Sight_Range: 8
    ,Attack_Range: 0.4
    ,weapons: [Whip]
    ,correction: {
        Whip: [
            [0, 0, 0],
            [0, 0, 0]
        ],
    }
    ,Base_Attack: (character, enemy) => {
        if (character.weapon) {
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
            const ba = baseAttackDamage(character, enemy, 0, 1, character.critical_strike_chance, 1);
            const damage = round(ba * character.attack_speed * 100) / 100;
            const life = calcHeal(ba * (character.life_steal / 100), character.attack_speed, enemy);
            return "<b class='damage'>" + damage + "</b><b> __h/s: </b><b class='heal'>" + life + '</b>';
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
            const min = calcSkillDamage(character, enemy, 30 + q * 30, 0.3, 1);
            const max = calcSkillDamage(character, enemy, 30 + q * 30 + character.max_hp * (0.05 + q * 0.005), 0.3, 1);
            const cool = 10000 / (2 * (100 - character.cooldown_reduction));
            return "<b class='damage'>" + min + ' - ' + max  + "</b><b> __sd/s: </b><b class='damage'>" + round(max * cool) / 100 + '</b>';
        }
        return '-';
    }
    ,Q_Option: ''
    ,W_Skill: (character, enemy) => {
        if (character.weapon) {
            const w = character.W_LEVEL.selectedIndex;
            const damage1 = calcSkillDamage(character, enemy, 30 + w * 10, 0.3, 1);
            const damage2 = calcSkillDamage(character, enemy, 40 + w * 35, 0.6, 1);
            const cool = 10000 / ((12 - w * 1) * (100 - character.cooldown_reduction));
            return "<b class='damage'>" + damage1 + ' - ' + (damage1 + damage2)  + '</b> ( ' + damage1 + ', ' + damage2 + " )<b> __sd/s: </b><b class='damage'>" + round((damage1 + damage2) * cool) / 100 + '</b>';
        }
        return '-';
    }
    ,W_Option: ''
    ,E_Skill: (character, enemy) => {
        if (character.weapon) {
            const e = character.E_LEVEL.selectedIndex;
            const damage = calcSkillDamage(character, enemy, 20 + e * 60, 0.3, 1);
            const cool = 10000 / (9 * (100 - character.cooldown_reduction));
            return "<b class='damage'>" + damage + "</b><b> __sd/s: </b><b class='damage'>" + round(damage * cool) / 100 + '</b>';
        }
        return '-';
    }
    ,E_Option: ''
    ,R_Skill: (character, enemy) => {
        if (character.weapon) {
            const r = character.R_LEVEL.selectedIndex
            const damage = calcSkillDamage(character, enemy, 50 + r * 50, 0.8, 1);
            const add = calcTrueDamage(character, enemy, 10 + r * 5);
            const hit = enemy.movement_speed ? enemy.movement_speed * (3 + r) | 0 : 0;
            return "<b class='damage'>" + (damage * 2) + ' ~ ' + (damage * 2 + add * 2 * hit) + '</b> ( ' + damage + ' x 2, [' + add + ' x 2] x ' + hit + ' )';
        }
        return '-';
    }
    ,R_Option: ''
    ,D_Skill: (character, enemy) => {
        if (character.weapon && character.WEAPON_MASTERY.selectedIndex > 5) {
            const type = character.weapon.Type;
            if (type === 'Whip') {
                return "<b class='damage'>" + calcSkillDamage(character, enemy, character.WEAPON_MASTERY.selectedIndex < 13 ? 100 + character.defense : 150, 0.3, 1) + '</b>';
            }
        }
        return '- ';
    }
    ,D_Option: (character, enemy) => {
        return '';
    }
    ,T_Skill: (character, enemy) => {
        if (character.weapon) {
            return "<b> _s: </b><b class='shield'>" + (character.max_hp * 0.1 | 0) + '</b>';
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
            weapon === 'Whip' ? '채찍' : 
            '';
        const skill = 
            weapon === 'Whip' ? '"스킬 데미지"' : 
            '';
        return '레녹스 ( ' + type + ' )\n' + 
            'A: "평균 데미지" ( "평타 데미지" - "치명타 데미지" )\n' + 
            'DPS: "초당 데미지" __h/s: "초당 흡혈량"\n' + 
            'HPS: "초당 회복량"\n' + 
            'Q: "최소 데미지" - "최대 데미지"\n' + 
            'W: "1타 데미지" - "합산 데미지" ( "1타 데미지", "2타 데미지" )\n' + 
            'E: "스킬 데미지"\n' + 
            'R: "합산 데미지" - "출혈 데미지" ( "스킬 데미지" x 2,  "틱당 데미지" x "타수" )\n' + 
            'D: ' + skill + '\n' + 
            'T: _s: "쉴드량"\n';
    }
    ,COMBO: (character, enemy) => {
        if (character.weapon) {
            const type = character.weapon.Type;
            const q = character.Q_LEVEL.selectedIndex;
            const w = character.W_LEVEL.selectedIndex;
            const e = character.E_LEVEL.selectedIndex;
            const r = character.R_LEVEL.selectedIndex;
            const wm = character.WEAPON_MASTERY.selectedIndex;
            let damage = 0, c;
            const combo = character.COMBO_OPTION.value;
            for (let i = 0; i < combo.length; i++) {
                c = combo.charAt(i);
                if (c === 'a') {
                    damage += baseAttackDamage(character, enemy, 0, 1, 0, 1);
                } else if (c === 'A') {
                    damage += baseAttackDamage(character, enemy, 0, 1, 100, 1);
                } else if (c === 'q') {
                    damage += calcSkillDamage(character, enemy, 30 + q * 30, 0.3, 1);
                } else if (c === 'Q') {
                    damage += calcSkillDamage(character, enemy, 30 + q * 30 + character.max_hp * (0.05 + q * 0.005), 0.3, 1);
                } else if (c === 'w') {
                    damage += calcSkillDamage(character, enemy, 40 + w * 35, 0.6, 1);
                } else if (c === 'W') {
                    damage += calcSkillDamage(character, enemy, 30 + w * 10, 0.3, 1) + 
                        calcSkillDamage(character, enemy, 40 + w * 35, 0.6, 1);
                } else if (c === 'e' || c === 'E') {
                    damage += calcSkillDamage(character, enemy, 20 + e * 60, 0.3, 1);
                } else if (c === 'r') {
                    damage += calcSkillDamage(character, enemy, 50 + r * 50, 0.8, 1) + 
                        calcTrueDamage(character, enemy, 10 + r * 5) * (enemy.movement_speed ? enemy.movement_speed * (3 + r) | 0 : 0);
                } else if (c === 'R') {
                    damage += (calcSkillDamage(character, enemy, 50 + r * 50, 0.8, 1) + 
                        calcTrueDamage(character, enemy, 10 + r * 5) * (enemy.movement_speed ? enemy.movement_speed * (3 + r) | 0 : 0)) * 2;
                } else if (c === 'd' || c === 'D') {
                    if (wm > 5) {
                        if (type === 'Whip') {
                            damage += calcSkillDamage(character, enemy, character.WEAPON_MASTERY.selectedIndex < 13 ? 100 + character.defense : 150, 0.3, 1);
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
    ,COMBO_Option: 'QeWadRaQa'
    ,COMBO_Help: (character) => {
        if (!character.character) {
            return 'select character plz';
        }
        if (!character.weapon) {
            return 'select weapon plz';
        }
        const weapon = character.weapon.Type;
        const d = 
            weapon === 'Whip' ? 'd & D: 무스 데미지\n' : 
            '';
        return 'a: 기본공격 데미지\n' + 
            'A: 치명타 데미지\n' +
            'q: Q스킬 최소 데미지\n' + 
            'Q: Q스킬 최대 데미지\n' + 
            'w: W스킬 2타 데미지\n' +  
            'W: W스킬 최대 데미지\n' +  
            'e & E: E스킬 데미지\n' + 
            'r: R스킬 1타 데미지\n' + 
            'R: R스킬 최대 데미지\n' + 
            't & T: 데미지 없음\n' + 
            d + 
            'p & P: 트랩 데미지';
    }
};
