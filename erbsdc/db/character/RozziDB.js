const Rozzi = {
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
    ,weapons: [Pistol]
    ,correction: {
        Pistol: [
            [0, -15, -11],
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
            const as = 10 / (9.5 / character.attack_speed + 2);
            const shot = baseAttackDamage(character, enemy, 0, 0.32, character.critical_strike_chance, 1) * 2 + 
                baseAttackDamage(character, enemy, 0, 0.48, character.critical_strike_chance, 1);
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
            const damage = calcSkillDamage(character, enemy, 40 + q * 40, 0.3, 1);
            const cool = 10000 / (6 * (100 - character.cooldown_reduction) - 200);
            return "<b class='damage'>" + damage + "</b><b> __sd/s: </b><b class='damage'>" + round(damage * cool) / 100 + '</b>';
        }
        return '-';
    }
    ,Q_Option: ''
    ,W_Skill: (character, enemy) => {
        if (character.weapon) {
            const w = character.W_LEVEL.selectedIndex;
            const damage = calcSkillDamage(character, enemy, 70 + w * 40, 0.35, 1);
            const cool = 10000 / ((9 - w * 0.5) * (100 - character.cooldown_reduction) + 30);
            return "<b class='damage'>" + damage + "</b><b> __sd/s: </b><b class='damage'>" + round(damage * cool) / 100 + '</b>';
        }
        return '-';
    }
    ,W_Option: ''
    ,E_Skill: (character, enemy) => {
        if (character.weapon) {
            const e = character.E_LEVEL.selectedIndex;
            const damage1 = calcSkillDamage(character, enemy, 50 + e * 20, 0.4, 1);
            const damage2 = calcSkillDamage(character, enemy, 50 + e * 20, 0.45, 1);
            const cool = 10000 / ((18 - e * 2) * (100 - character.cooldown_reduction) + 50);
            return "<b class='damage'>" + (damage1 + damage2) + '</b> ( ' + damage1 + ', ' + damage2 + " )<b> __sd/s: </b><b class='damage'>" + round((damage1 + damage2) * cool) / 100 + '</b>';
        }
        return '-';
    }
    ,E_Option: ''
    ,R_Skill: (character, enemy) => {
        if (character.weapon) {
            const r = character.R_LEVEL.selectedIndex;
            const damage1 = calcSkillDamage(character, enemy, 100 + r * 100, 0.45, 1);
            const damage2 = calcTrueDamage(character, enemy, enemy.max_hp ? enemy.max_hp * (0.04 + r * 0.04) : 0);
            return "<b class='damage'>" + damage1 + ' - ' + (damage1 + damage2) + '</b> ( ' + damage1 + ', ' + damage2 + ' )';
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
        }
        return ' -';
    }
    ,D_Option: (character, enemy) => {
        return '';
    }
    ,T_Skill: (character, enemy) => {
        if (character.weapon) {
            const t = character.T_LEVEL.selectedIndex;
            const coe = 0.6 + t * 0.1;
            const damage1 = baseAttackDamage(character, enemy, 0, 0.7, character.critical_strike_chance, 1);
            const damage2 = baseAttackDamage(character, enemy, 0, coe, character.critical_strike_chance, 1);
            const min1 = baseAttackDamage(character, enemy, 0, 0.7, 0, 1);
            const min2 = baseAttackDamage(character, enemy, 0, coe, 0, 1);
            const max1 = baseAttackDamage(character, enemy, 0, 0.7, 100, 1);
            const max2 = baseAttackDamage(character, enemy, 0, coe, 100, 1);
            return "<b class='damage'>" + (damage1 + damage2) + '</b> ( ' +  min1 + ', ' + min2 + ' - ' + max1 + ', ' + max2 + ' ) ';
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
            '';
        const skill = 
            weapon === 'Pistol' ? '"데미지 없음"' :  
            '';
        return '로지 ( ' + type + ' )\n' + 
            'A: "평균 데미지" ( "최소 데미지" - "치명타 데미지" )\n' + 
            'DPS: "초당 데미지" __h/s: "초당 흡혈량"\n' + 
            'HPS: "초당 회복량"\n' + 
            'Q: "스킬 데미지"\n' + 
            'W: "스킬 데미지"\n' + 
            'E: "합산 데미지" ( "1타 데미지", "2타 데미지" )\n' + 
            'R: "최소 데미지" - "최대 데미지"\n' + 
            'D: ' + skill + '\n' + 
            'T: "평균 데미지" ( "1타 데미지", "2타 데미지" - "1타 치명타", "2타 치명타" )\n';
    }
    ,COMBO: (character, enemy) => {
        if (character.weapon) {
            const type = character.weapon.Type;
            const q = character.Q_LEVEL.selectedIndex;
            const w = character.W_LEVEL.selectedIndex;
            const e = character.E_LEVEL.selectedIndex;
            const r = character.R_LEVEL.selectedIndex;
            const t = character.T_LEVEL.selectedIndex;
            const wm = character.WEAPON_MASTERY.selectedIndex;
            let damage = 0, c;
            const coe = 0.6 + t * 0.1;
            let ee = false;
            const combo = character.COMBO_OPTION.value;
            for (let i = 0; i < combo.length; i++) {
                c = combo.charAt(i);
                if (c === 'a') {
                    damage += baseAttackDamage(character, enemy, 0, 1, 0, 1);
                } else if (c === 'A') {
                    damage += baseAttackDamage(character, enemy, 0, 1, 100, 1);
                } else if (c === 'q' || c === 'Q') {
                    damage += calcSkillDamage(character, enemy, 40 + q * 40, 0.3, 1);
                } else if (c === 'w' || c === 'W') {
                    damage += calcSkillDamage(character, enemy, 70 + w * 40, 0.35, 1);
                } else if (c === 'e' || c === 'E') {
                    if (ee) {
                        ee = false;
                        damage += calcSkillDamage(character, enemy, 50 + e * 20, 0.4, 1);
                    } else {
                        ee = true;
                        damage += calcSkillDamage(character, enemy, 50 + e * 20, 0.45, 1);
                    }
                } else if (c === 'r') {
                    damage += calcSkillDamage(character, enemy, 100 + r * 100, 0.45, 1);
                } else if (c === 'R') {
                    damage += calcSkillDamage(character, enemy, 100 + r * 100, 0.45, 1) + 
                        calcTrueDamage(character, enemy, enemy.max_hp ? enemy.max_hp * (0.04 + r * 0.04) : 0);
                } else if (c === 't') {
                    damage += baseAttackDamage(character, enemy, 0, 0.7, 0, 1) + 
                        baseAttackDamage(character, enemy, 0, coe, 0, 1);
                } else if (c === 'T') {
                    damage += baseAttackDamage(character, enemy, 0, 0.7, 100, 1) + 
                        baseAttackDamage(character, enemy, 0, coe, 100, 1);
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
};
