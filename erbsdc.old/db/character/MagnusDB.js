const Magnus = {
     Attack_Power: 32
    ,Attack_Power_Growth: 1.5
    ,Health: 600
    ,Health_Growth: 91
    ,Health_Regen: 1
    ,Health_Regen_Growth: 0.05
    ,Stamina: 410
    ,Stamina_Growth: 14
    ,Stamina_Regen: 1.9
    ,Stamina_Regen_Growth: 0.06
    ,Defense: 25
    ,Defense_Growth: 1.5
    ,Atk_Speed: 0.12
    ,Crit_Rate: 0
    ,Move_Speed: 3.2
    ,Sight_Range: 8
    ,Attack_Range: 0.5
    ,weapons: [Hammer, Bat]
    ,correction: {
        Hammer: [
            [0, -5, -5],
            [0, 0, 0]
        ],
        Bat: [
            [0, -3, -3],
            [0, 0, 0]
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
            const damage = calcSkillDamage(character, enemy, 40 + q * 60, 0.6, 1);
            const cool = 10000 / ((18 - q * 2) * (100 - character.cooldown_reduction) + 80);
            return "<b class='damage'>" + damage + "</b><b> __sd/s: </b><b class='damage'>" + round(damage * cool) / 100 + '</b>';
        }
        return '-';
    }
    ,Q_Option: ''
    ,W_Skill: (character, enemy) => {
        if (character.weapon) {
            const w = character.W_LEVEL.selectedIndex;
            const damage = calcSkillDamage(character, enemy, (1.5 + w * 0.5 | 0) * 10 + character.defense * 0.3, 0.3, 1);
            const cool = 10000 / (10 * (100 - character.cooldown_reduction) + 400);
            return "<b class='damage'>" + damage * (6 + w * 0.5 | 0) + '</b> ( ' + damage + ' x ' + (6 + w * 0.5 | 0) + " )<b> __sd/s: </b><b class='damage'>" + round((damage * (6 + w * 0.5 | 0)) * cool) / 100 + '</b>';
        }
        return '-';
    }
    ,W_Option: ''
    ,E_Skill: (character, enemy) => {
        if (character.weapon) {
            const e = character.E_LEVEL.selectedIndex;
            const damage = calcSkillDamage(character, enemy, 60 + e * 55, 0.4, 1);
            const cool = 10000 / ((12 - e * 1) * (100 - character.cooldown_reduction) + 20);
            return "<b class='damage'>" + damage + "</b><b> __sd/s: </b><b class='damage'>" + round(damage * cool) / 100 + '</b>';
        }
        return '-';
    }
    ,E_Option: ''
    ,R_Skill: (character, enemy) => {
        if (character.weapon) {
            return "<b class='damage'>" + calcSkillDamage(character, enemy, 200 + character.R_LEVEL.selectedIndex * 200, 2, 1) + '</b>';
        }
        return '-';
    }
    ,R_Option: ''
    ,D_Skill: (character, enemy) => {
        if (character.weapon && character.WEAPON_MASTERY.selectedIndex > 5) {
            const type = character.weapon.Type;
            if (type === 'Hammer') {
                return "<b class='damage'>" + calcSkillDamage(character, enemy, character.WEAPON_MASTERY.selectedIndex < 13 ? 150 + character.defense : 300 + character.defense * 2, 0, 1) + '</b>';
            }
            if (type === 'Bat') {
                return "<b class='damage'>" + calcSkillDamage(character, enemy, 0, character.WEAPON_MASTERY.selectedIndex < 13 ? 2 : 3, 1) + '</b>';
            }
        }
        return '-';
    }
    ,D_Option: (character, enemy) => {
        return !character.weapon || character.weapon.Type !== 'Hammer' ? '' : 
            "<b> __use</b><input type='checkbox' class='hammer_d' onchange='updateDisplay()'>"; 
    }
    ,T_Skill: (character, enemy) => {
        return '';
    }
    ,T_Option: "_LostHP: <input type='number' class='stack magnus_t' value='0' onchange='fixLimitNum(this, 100)'><b>%</b>"
    ,Help: (character) => {
        if (!character.character) {
            return 'select character plz';
        }
        if (!character.weapon) {
            return 'select weapon plz';
        }
        const weapon = character.weapon.Type;
        const type = 
            weapon === 'Hammer' ? '망치' : 
            weapon === 'Bat' ? '방망이' : 
            '';
        const skill = 
            weapon === 'Hammer' ? '"스킬 데미지" _use "스킬 사용"' : 
            weapon === 'Bat' ? '"스킬 데미지"' : 
            '';
        return '매그너스 ( ' + type + ' )\n' + 
            'A: "평균 데미지" ( "평타 데미지" - "치명타 데미지" )\n' + 
            'DPS: "초당 데미지" __h/s: "초당 흡혈량"\n' + 
            'HPS: "초당 회복량"\n' + 
            'Q: "스킬 데미지"\n' + 
            'W: "합산 데미지" ( "틱당 데미지" x "타수" )\n' + 
            'E: "스킬 데미지"\n' + 
            'R: "스킬 데미지"\n' + 
            'D: ' + skill + '\n' + 
            'T: _"잃은 체력"\n';
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
            let dd = false;

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
                    damage += calcSkillDamage(character, enemy, 40 + q * 60, 0.6, 1);
                } else if (c === 'w' || c === 'W') {
                    damage += calcSkillDamage(character, enemy, (1.5 + w * 0.5 | 0) * 10 + character.defense * 0.3, 0.3, 1) * 
                        (6 + w * 0.5 | 0);
                } else if (c === 'e' || c === 'E') {
                    damage += calcSkillDamage(character, enemy, 60 + e * 55, 0.4, 1);
                } else if (c === 'r' || c === 'R') {
                    damage += calcSkillDamage(character, enemy, 200 + r * 200, 2, 1);
                } else if (c === 'd' || c === 'D') {
                    if (wm > 5) {
                        if (type === 'Hammer') {
                            if (!dd && enemy.defense) {
                                dd = true;
                                enemy.defense = enemy.calc_defense * (1 - (wm < 13 ? 0.25 : 0.4)) | 0;
                            }
                            damage +=  calcSkillDamage(character, enemy, wm < 13 ? 150 + character.defense : 300 + character.defense * 2, 0, 1);
                        }
                        if (type === 'Bat') {
                            damage += calcSkillDamage(character, enemy, 0, wm < 13 ? 2 : 3, 1);
                        }
                    }
                } else if (c === 't' || c === 'T') {
                    damage += calcSkillDamage(character, enemy, 25 + t * 35, 0.3, 1);
                }
            }

            if (enemy_defense) {
                enemy.defense = enemy_defense;
            }

            return "<b class='damage'>" + damage + '</b><b> _ : ' + (enemy.max_hp ? (damage / enemy.max_hp * 10000 | 0) / 100 : '-') + '%</b>';
        }
        return '-';
    }
};