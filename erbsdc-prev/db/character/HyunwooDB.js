const Hyunwoo = {
     Attack_Power: 40
    ,Attack_Power_Growth: 3.1
    ,Health: 500
    ,Health_Growth: 85
    ,Health_Regen: 0.8
    ,Health_Regen_Growth: 0.04
    ,Stamina: 350
    ,Stamina_Growth: 16
    ,Stamina_Regen: 1.8
    ,Stamina_Regen_Growth: 0.04
    ,Defense: 26
    ,Defense_Growth: 2.2
    ,Atk_Speed: 0.12
    ,Crit_Rate: 0
    ,Move_Speed: 3.15
    ,Sight_Range: 8
    ,Attack_Range: 0.45
    ,weapons: [Glove, Tonfa]
    ,correction: {
        Glove: [
            [0, 0, -3],
            [0, -2, -5]
        ],
        Tonfa: [
            [0, -3, -3],
            [0, -2, -5]
        ]
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
            const damage = calcSkillDamage(character, enemy, 100 + q * 50, 0.4, 1);
            const cool = 10000 / ((10 - q * 1) * (100 - character.cooldown_reduction));
            return "<b class='damage'>" + damage + "</b><b> __sd/s: </b><b class='damage'>" + round(damage * cool) / 100 + '</b>';
        }
        return '-';
    }
    ,Q_Option: ''
    ,W_Skill: (character, enemy) => {
        return '';
    }
    ,W_Option: "<b> _use</b><input type='checkbox' class='hyunwoo_w' onchange='updateDisplay()'>"
    ,E_Skill: (character, enemy) => {
        if (character.weapon) {
            const e = character.E_LEVEL.selectedIndex;
            const min = calcSkillDamage(character, enemy, character.defense, 0, 1);
            const max = calcSkillDamage(character, enemy, (enemy.max_hp ? enemy.max_hp * (0.05 + e * 0.03) : 0) + character.defense, 0, 1);
            const bonus = calcSkillDamage(character, enemy, 60 + e * 35, 0, 1);
            const cool = 10000 / ((13 - e * 0.5) * (100 - character.cooldown_reduction));
            return "<b class='damage'>" + (max + bonus) + '</b> ( ' + min + ' ~ ' + max + ', ' + bonus + " )<b> __sd/s: </b><b class='damage'>" + round((min + max + bonus) / 2 * cool) / 100 + '</b>';
        }
        return '-';
    }
    ,E_Option: "<b> __use</b><input type='checkbox' class='hyunwoo_e' onchange='updateDisplay()'>"
    ,R_Skill: (character, enemy) => {
        if (character.weapon) {
            const r = character.R_LEVEL.selectedIndex;
            const min = calcSkillDamage(character, enemy, 200 + r * 100, 0.7, 1);
            const max = calcSkillDamage(character, enemy, 600 + r * 300, 2.1, 1);
            return "<b class='damage'>" + min + ' ~ ' + max + '</b>';
        }
        return '-';
    }
    ,R_Option: ''
    ,D_Skill: (character, enemy) => {
        const wm = character.WEAPON_MASTERY.selectedIndex;
        if (character.weapon && wm > 5) {
            const type = character.weapon.Type;
            if (type === 'Glove') {
                const coe = wm < 13 ? 1 : 2;
                const bonus = calcTrueDamage(character, enemy, wm < 13 ? 50 : 100);
                const damage = baseAttackDamage(character, enemy, 0, 1 + coe, character.critical_strike_chance, 1) + bonus;
                const min = baseAttackDamage(character, enemy, 0, 1 + coe, 0, 1) + bonus;
                const max = baseAttackDamage(character, enemy, 0, 1 + coe, 100, 1) + bonus;
                const life = calcHeal(damage * (character.life_steal / 100), 1, enemy);
                return "<b class='damage'>" + damage + '</b> ( ' +  min + " - <b class='damage'>" + max + "</b> )<b> __h: </b><b class='heal'>" + life + '</b>';
            }
            if (type === 'Tonfa') {
                return "<b class='damage'>" + (wm < 13 ? 50 : 70) + '%</b>';
            }
        }
        return '-';
    }
    ,D_Option: (character, enemy) => {
        return '';
    }
    ,T_Skill: (character, enemy) => {
        if (character.weapon) {
            return "<b> _h: </b><b class='heal'>" + calcHeal(character.max_hp * (0.07 + character.T_LEVEL.selectedIndex * 0.04), 1, enemy) + '</b>';
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
            weapon === 'Glove' ? '글러브' : 
            weapon === 'Tonfa' ? '톤파' : 
            '';
        const skill = 
            weapon === 'Glove' ? '"평균 데미지" ( "평타 데미지" - "치명타 데미지" ) __h: "평균 흡혈량"' : 
            weapon === 'Tonfa' ? '"반사 데미지"' : 
            '';
        return '현우 ( ' + type + ' )\n' + 
            'A: "평균 데미지" ( "평타 데미지" - "치명타 데미지" )\n' + 
            'DPS: "초당 데미지" __h/s: "초당 흡혈량"\n' + 
            'HPS: "초당 회복량"\n' + 
            'Q: "스킬 데미지"\n' + 
            'W: _use "스킬 사용"\n' + 
            'E: "합산 데미지" ( "최소 데미지" ~ "최대 데미지", "벽꿍 데미지" )\n' + 
            'R: "최소 데미지" ~ "최대 데미지"\n' + 
            'D: ' + skill + '\n' + 
            'T: _h: "회복량"\n';
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
            let ww = false, ee = false;

            const defense = character.defense;
            character.defense = character.pure_defense | 0;
            let enemy_defense;
            if (enemy.calc_defense) {
                enemy_defense = enemy.defense;
                enemy.defense = enemy.calc_defense | 0;
            }

            const combo = character.COMBO_OPTION.value;
            for (let i = 0; i < combo.length; i++) {
                c = combo.charAt(i);
                if (c === 'a') {
                    damage += baseAttackDamage(character, enemy, 0, 1, 0, 1);
                } else if (c === 'A') {
                    damage += baseAttackDamage(character, enemy, 0, 1, 100, 1);
                } else if (c === 'q' || c === 'Q') {
                    damage += calcSkillDamage(character, enemy, 100 + q * 50, 0.4, 1);
                } else if (c === 'w' || c === 'W') {
                    if (!ww) {
                        ww = true;
                        character.defense = (character.pure_defense + 4 + w * 14) * 1.1 | 0
                    }
                } else if (c === 'e') {
                    if (!ee && enemy.defense) {
                        ee = true;
                        enemy.defense = enemy.calc_defense * (1 - (0.07 + e * 0.02)) | 0;
                    }
                    damage += calcSkillDamage(character, enemy, (enemy.max_hp ? (enemy.max_hp - damage) * (0.05 + e * 0.03) : 0) + character.defense, 0, 1);
                    if (ww) {
                        ww = false;
                        character.defense = character.pure_defense | 0;
                    }
                } else if (c === 'E') {
                    if (!ee && enemy.defense) {
                        ee = true;
                        enemy.defense = enemy.calc_defense * (1 - (0.07 + e * 0.02)) | 0;
                    }
                    damage += calcSkillDamage(character, enemy, (enemy.max_hp ? (enemy.max_hp - damage) * (0.05 + e * 0.03) : 0) + character.defense, 0, 1) + 
                        calcSkillDamage(character, enemy, 60 + e * 35, 0, 1);
                    if (ww) {
                        ww = false;
                    }
                } else if (c === 'r') {
                    damage += calcSkillDamage(character, enemy, 200 + r * 100, 0.7, 1);
                } else if (c === 'R') {
                    damage += calcSkillDamage(character, enemy, 600 + r * 300, 2.1, 1);
                } else if (c === 'd') {
                    if (wm > 5) {
                        if (type === 'Glove') {
                            const coe = wm < 13 ? 1 : 2;
                            const bonus = calcTrueDamage(character, enemy, wm < 13 ? 50 : 100);
                            damage += baseAttackDamage(character, enemy, 0, 1 + coe, 0, 1) + bonus;
                        } else if (type === 'Tonfa') {
                            damage += 0;
                        }
                    }
                } else if (c === 'D') {
                    if (wm > 5) {
                        if (type === 'Glove') {
                            const coe = wm < 13 ? 1 : 2;
                            const bonus = calcTrueDamage(character, enemy, wm < 13 ? 50 : 100);
                            damage += baseAttackDamage(character, enemy, 0, 1 + coe, 100, 1) + bonus;
                        } else if (type === 'Tonfa') {
                            damage += 0;
                        }
                    }
                }
            }

            character.defense = defense;
            if (enemy_defense) {
                enemy.defense = enemy_defense;
            }

            return "<b class='damage'>" + damage + '</b><b> _ : ' + (enemy.max_hp ? (damage / enemy.max_hp * 10000 | 0) / 100 : '-') + '%</b>';
        }
        return '-';
    }
};