#!/usr/bin/env node

// filegod macos edition
// by grim
// https://github.com/iamgrim-iq

const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

const RED = '\x1b[31m';
const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const CYAN = '\x1b[36m';
const BOLD = '\x1b[1m';

const ASCII_TITLE = `
  █████▒██▓ ██▓    ▓█████   ▄████  ▒█████  ▓█████▄ 
▓██   ▒▓██▒▓██▒    ▓█   ▀  ██▒ ▀█▒▒██▒  ██▒▒██▀ ██▌
▒████ ░▒██▒▒██░    ▒███   ▒██░▄▄▄░▒██░  ██▒░██   █▌
░▓█▒  ░░██░▒██░    ▒▓█  ▄ ░▓█  ██▓▒██   ██░░▓█▄   ▌
░▒█░   ░██░░██████▒░▒████▒░▒▓███▀▒░ ████▓▒░░▒████▓ 
 ▒ ░   ░▓  ░ ▒░▓  ░░░ ▒░ ░ ░▒   ▒ ░ ▒░▒░▒░  ▒▒▓  ▒ 
 ░      ▒ ░░ ░ ▒  ░ ░ ░  ░  ░   ░   ░ ▒ ▒░  ░ ▒  ▒ 
 ░ ░    ▒ ░  ░ ░      ░   ░ ░   ░ ░ ░ ░ ▒   ░ ░  ░ 
        ░      ░  ░   ░  ░      ░     ░ ░     ░    
                                            ░      
`;

const FILE_TYPES = {
    'Images': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tiff', '.svg', '.webp', '.avif', '.ico', '.heic', '.heif'],
    'Video': ['.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv', '.webm', '.m4v', '.3gp'],
    'Audio': ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.wma', '.m4a', '.opus', '.aiff', '.caf'],
    'Programs': ['.app', '.pkg', '.dmg', '.deb', '.rpm', '.exe', '.msi'],
    'Installers': ['.pkg', '.dmg', '.installer'],
    'Docx': ['.docx', '.doc', '.txt', '.pdf', '.rtf', '.odt', '.pages', '.key', '.numbers'],
    'ZIP': ['.zip', '.rar', '.7z', '.tar', '.gz', '.bz2', '.xz', '.tar.gz', '.tar.bz2', '.sitx'],
    'Code': ['.py', '.js', '.ts', '.html', '.css', '.cpp', '.c', '.cs', '.java', '.php', '.rb', '.go', '.rs', '.kt', '.swift', '.r', '.scala', '.m', '.mm', '.plist'],
    'Scripts': ['.sh', '.zsh', '.bash', '.fish', '.command', '.applescript', '.scpt', '.automator']
};

const TEXT_FILE_TYPES = ['.txt', '.js', '.ts', '.py', '.html', '.css', '.json', '.xml', '.md', '.csv', '.log', '.ini', '.cfg', '.conf', '.yml', '.yaml', '.sql', '.php', '.rb', '.go', '.rs', '.cpp', '.c', '.cs', '.java', '.kt', '.swift', '.r', '.scala', '.sh', '.zsh', '.bash', '.m', '.mm', '.plist'];

class FileGodMacOS {
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    createContainer(content, title = '', width = 80) {
        const terminalWidth = process.stdout.columns || 80;
        const containerWidth = Math.min(width, terminalWidth - 4);
        const padding = Math.max(0, Math.floor((terminalWidth - containerWidth) / 2));
        
        const lines = content.split('\n');
        const border = '─'.repeat(containerWidth - 2);
        const paddingStr = ' '.repeat(padding);
        
        let result = '';
        
        result += paddingStr + RED + '┌' + border + '┐' + RESET + '\n';
        
        if (title) {
            const titlePadding = Math.max(0, Math.floor((containerWidth - 2 - title.length) / 2));
            const titleLine = ' '.repeat(titlePadding) + title + ' '.repeat(containerWidth - 2 - titlePadding - title.length);
            result += paddingStr + RED + '│' + BOLD + titleLine + RESET + RED + '│' + RESET + '\n';
            result += paddingStr + RED + '├' + border + '┤' + RESET + '\n';
        }
        
        lines.forEach(line => {
            const lineContent = line.substring(0, containerWidth - 4);
            const linePadding = containerWidth - 2 - lineContent.length;
            result += paddingStr + RED + '│ ' + RESET + lineContent + ' '.repeat(linePadding) + RED + '│' + RESET + '\n';
        });
        
        result += paddingStr + RED + '└' + border + '┘' + RESET + '\n';
        
        return result;
    }

    centerText(text) {
        const terminalWidth = process.stdout.columns || 80;
        const lines = text.split('\n');
        return lines.map(line => {
            const padding = Math.max(0, Math.floor((terminalWidth - line.length) / 2));
            return ' '.repeat(padding) + RED + line + RESET;
        }).join('\n');
    }

    clearWithTitle() {
        console.clear();
        if (ASCII_TITLE.trim()) {
            console.log(this.centerText(ASCII_TITLE));
        }
    }

    showProgressBar(current, total, label = '') {
        const width = 40;
        const progress = Math.floor((current / total) * width);
        const percentage = Math.floor((current / total) * 100);
        
        const bar = '█'.repeat(progress) + '░'.repeat(width - progress);
        const progressText = `[${bar}] ${percentage}% ${label}`;
        
        process.stdout.write('\r' + this.centerText(progressText).replace(/\n/g, ''));
    }

    showMainMenu() {
        this.clearWithTitle();
        
        const menuContent = `
[1] СОРТИРОВКА
[2] МЕДИА
[3] АНАЛИЗ
[4] ПОИСК
[0] Выход`;
        
        console.log(this.createContainer(menuContent, '🍎 FILEGOD macOS - ГЛАВНОЕ МЕНЮ 🍎'));
        
        process.stdout.write(RED + '\n' + ' '.repeat(Math.max(0, Math.floor((process.stdout.columns - 'Выберите опцию: '.length) / 2))) + 'Выберите опцию: ' + RESET);
        
        this.rl.once('line', (answer) => {
            switch(answer.trim()) {
                case '1':
                    this.showSortMenu();
                    break;
                case '2':
                    this.showMediaMenu();
                    break;
                case '3':
                    this.showAnalysisMenu();
                    break;
                case '4':
                    this.showSearchMenu();
                    break;
                case '0':
                    console.log(this.centerText('🍎 До свидания! 🍎'));
                    process.exit(0);
                    break;
                default:
                    console.log(this.centerText('Неверная опция. Попробуйте снова.'));
                    setTimeout(() => this.showMainMenu(), 1500);
                    break;
            }
        });
    }

    showSearchMenu() {
        const searchContent = `
[1] По имени
[2] По содержимому (строки)
[3] Поиск с фильтром
[0] В главное меню`;
        
        console.log(this.createContainer(searchContent, '🔍 ПОИСК'));
        
        process.stdout.write(RED + '\n' + ' '.repeat(Math.max(0, Math.floor((process.stdout.columns - 'Выберите опцию: '.length) / 2))) + 'Выберите опцию: ' + RESET);
        
        this.rl.once('line', (answer) => {
            switch(answer.trim()) {
                case '1':
                    this.searchByName();
                    break;
                case '2':
                    this.searchByContent();
                    break;
                case '3':
                    this.showFilterSearchMenu();
                    break;
                case '0':
                    this.showMainMenu();
                    break;
                default:
                    console.log(this.centerText('Неверная опция. Попробуйте снова.'));
                    setTimeout(() => this.showSearchMenu(), 1500);
                    break;
            }
        });
    }

    showFilterSearchMenu() {
        const filterContent = `
[1] Дата (от dd.mm.yyyy до dd.mm.yyyy)
[2] Название включает... (строка)
[3] Файл содержит внутри... (строка)
[4] Несколько фильтров
[0] Назад`;
        
        console.log(this.createContainer(filterContent, '🎯 ПОИСК С ФИЛЬТРОМ'));
        
        process.stdout.write(RED + '\n' + ' '.repeat(Math.max(0, Math.floor((process.stdout.columns - 'Выберите опцию: '.length) / 2))) + 'Выберите опцию: ' + RESET);
        
        this.rl.once('line', (answer) => {
            switch(answer.trim()) {
                case '1':
                    this.searchByDateFilter();
                    break;
                case '2':
                    this.searchByNameFilter();
                    break;
                case '3':
                    this.searchByContentFilter();
                    break;
                case '4':
                    this.searchWithMultipleFilters();
                    break;
                case '0':
                    this.showSearchMenu();
                    break;
                default:
                    console.log(this.centerText('Неверная опция. Попробуйте снова.'));
                    setTimeout(() => this.showFilterSearchMenu(), 1500);
                    break;
            }
        });
    }

    searchByDateFilter() {
        const dateContent = `
Введите путь к папке для поиска:`;
        
        console.log(this.createContainer(dateContent, '📅 ПОИСК ПО ДАТЕ'));
        process.stdout.write(RED + ' '.repeat(Math.max(0, Math.floor((process.stdout.columns - 2) / 2))) + '> ' + RESET);
        
        this.rl.once('line', (inputPath) => {
            const searchPath = path.resolve(this.expandMacOSPath(inputPath.trim()));
            
            const fromDateContent = `
Введите дату ОТ (dd.mm.yyyy):`;
            console.log(this.createContainer(fromDateContent, '📅 ОТ ДАТЫ'));
            process.stdout.write(RED + ' '.repeat(Math.max(0, Math.floor((process.stdout.columns - 2) / 2))) + '> ' + RESET);
            
            this.rl.once('line', (fromDate) => {
                const toDateContent = `
Введите дату ДО (dd.mm.yyyy):`;
                console.log(this.createContainer(toDateContent, '📅 ДО ДАТЫ'));
                process.stdout.write(RED + ' '.repeat(Math.max(0, Math.floor((process.stdout.columns - 2) / 2))) + '> ' + RESET);
                
                this.rl.once('line', async (toDate) => {
                    try {
                        await fs.access(searchPath);
                        const filters = {
                            dateFrom: this.parseDate(fromDate.trim()),
                            dateTo: this.parseDate(toDate.trim())
                        };
                        await this.performFilteredSearch(searchPath, filters);
                    } catch (error) {
                        console.log(this.centerText(`❌ Ошибка: ${error.message}`));
                        console.log(this.centerText('\nНажмите Enter для повтора...'));
                        this.rl.once('line', () => this.searchByDateFilter());
                    }
                });
            });
        });
    }

    expandMacOSPath(inputPath) {
        if (inputPath.startsWith('~')) {
            return path.join(process.env.HOME, inputPath.slice(1));
        }
        return inputPath;
    }

    searchByNameFilter() {
        const nameContent = `
Введите путь к папке для поиска:`;
        
        console.log(this.createContainer(nameContent, '📝 ПОИСК ПО НАЗВАНИЮ'));
        process.stdout.write(RED + ' '.repeat(Math.max(0, Math.floor((process.stdout.columns - 2) / 2))) + '> ' + RESET);
        
        this.rl.once('line', (inputPath) => {
            const searchPath = path.resolve(this.expandMacOSPath(inputPath.trim()));
            
            const queryContent = `
Какую строку должно содержать название?`;
            console.log(this.createContainer(queryContent, '🔤 СТРОКА ПОИСКА'));
            process.stdout.write(RED + ' '.repeat(Math.max(0, Math.floor((process.stdout.columns - 2) / 2))) + '> ' + RESET);
            
            this.rl.once('line', async (searchQuery) => {
                try {
                    await fs.access(searchPath);
                    const filters = {
                        nameContains: searchQuery.trim()
                    };
                    await this.performFilteredSearch(searchPath, filters);
                } catch (error) {
                    console.log(this.centerText(`❌ Ошибка: ${error.message}`));
                    console.log(this.centerText('\nНажмите Enter для повтора...'));
                    this.rl.once('line', () => this.searchByNameFilter());
                }
            });
        });
    }

    searchByContentFilter() {
        const contentFilterContent = `
Введите путь к папке для поиска:`;
        
        console.log(this.createContainer(contentFilterContent, '📄 ПОИСК ПО СОДЕРЖИМОМУ'));
        process.stdout.write(RED + ' '.repeat(Math.max(0, Math.floor((process.stdout.columns - 2) / 2))) + '> ' + RESET);
        
        this.rl.once('line', (inputPath) => {
            const searchPath = path.resolve(this.expandMacOSPath(inputPath.trim()));
            
            const queryContent = `
Какую строку должен содержать файл внутри?`;
            console.log(this.createContainer(queryContent, '🔍 СТРОКА В ФАЙЛЕ'));
            process.stdout.write(RED + ' '.repeat(Math.max(0, Math.floor((process.stdout.columns - 2) / 2))) + '> ' + RESET);
            
            this.rl.once('line', async (searchQuery) => {
                try {
                    await fs.access(searchPath);
                    const filters = {
                        contentContains: searchQuery.trim()
                    };
                    await this.performFilteredSearch(searchPath, filters);
                } catch (error) {
                    console.log(this.centerText(`❌ Ошибка: ${error.message}`));
                    console.log(this.centerText('\nНажмите Enter для повтора...'));
                    this.rl.once('line', () => this.searchByContentFilter());
                }
            });
        });
    }

    searchWithMultipleFilters() {
        const multiContent = `
Введите путь к папке для поиска:`;
        
        console.log(this.createContainer(multiContent, '🎯 МНОЖЕСТВЕННЫЕ ФИЛЬТРЫ'));
        process.stdout.write(RED + ' '.repeat(Math.max(0, Math.floor((process.stdout.columns - 2) / 2))) + '> ' + RESET);
        
        this.rl.once('line', (inputPath) => {
            const searchPath = path.resolve(this.expandMacOSPath(inputPath.trim()));
            
            const filtersListContent = `
Доступные фильтры:
1 - Дата (от dd.mm.yyyy до dd.mm.yyyy)
2 - Название включает... (строка)
3 - Файл содержит внутри... (строка)

Перечислите номера фильтров через запятую (например: 1, 2):`;
            
            console.log(this.createContainer(filtersListContent, '📋 ВЫБОР ФИЛЬТРОВ'));
            process.stdout.write(RED + ' '.repeat(Math.max(0, Math.floor((process.stdout.columns - 2) / 2))) + '> ' + RESET);
            
            this.rl.once('line', (filtersList) => {
                const selectedFilters = filtersList.split(',').map(f => f.trim());
                this.collectMultipleFilters(searchPath, selectedFilters, {});
            });
        });
    }

    async collectMultipleFilters(searchPath, remainingFilters, collectedFilters) {
        if (remainingFilters.length === 0) {
            try {
                await fs.access(searchPath);
                await this.performFilteredSearch(searchPath, collectedFilters);
            } catch (error) {
                console.log(this.centerText(`❌ Ошибка: ${error.message}`));
                console.log(this.centerText('\nНажмите Enter для возврата...'));
                this.rl.once('line', () => this.showFilterSearchMenu());
            }
            return;
        }
        
        const currentFilter = remainingFilters.shift();
        
        switch(currentFilter) {
            case '1':
                const dateContent = `
Введите дату ОТ (dd.mm.yyyy):`;
                console.log(this.createContainer(dateContent, '📅 ФИЛЬТР ДАТЫ'));
                process.stdout.write(RED + ' '.repeat(Math.max(0, Math.floor((process.stdout.columns - 2) / 2))) + '> ' + RESET);
                
                this.rl.once('line', (fromDate) => {
                    const toDateContent = `
Введите дату ДО (dd.mm.yyyy):`;
                    console.log(this.createContainer(toDateContent, '📅 ДО ДАТЫ'));
                    process.stdout.write(RED + ' '.repeat(Math.max(0, Math.floor((process.stdout.columns - 2) / 2))) + '> ' + RESET);
                    
                    this.rl.once('line', (toDate) => {
                        collectedFilters.dateFrom = this.parseDate(fromDate.trim());
                        collectedFilters.dateTo = this.parseDate(toDate.trim());
                        this.collectMultipleFilters(searchPath, remainingFilters, collectedFilters);
                    });
                });
                break;
                
            case '2':
                const nameContent = `
Какую строку должно содержать название?`;
                console.log(this.createContainer(nameContent, '📝 ФИЛЬТР НАЗВАНИЯ'));
                process.stdout.write(RED + ' '.repeat(Math.max(0, Math.floor((process.stdout.columns - 2) / 2))) + '> ' + RESET);
                
                this.rl.once('line', (nameQuery) => {
                    collectedFilters.nameContains = nameQuery.trim();
                    this.collectMultipleFilters(searchPath, remainingFilters, collectedFilters);
                });
                break;
                
            case '3':
                const contentContent = `
Какую строку должен содержать файл?`;
                console.log(this.createContainer(contentContent, '📄 ФИЛЬТР СОДЕРЖИМОГО'));
                process.stdout.write(RED + ' '.repeat(Math.max(0, Math.floor((process.stdout.columns - 2) / 2))) + '> ' + RESET);
                
                this.rl.once('line', (contentQuery) => {
                    collectedFilters.contentContains = contentQuery.trim();
                    this.collectMultipleFilters(searchPath, remainingFilters, collectedFilters);
                });
                break;
                
            default:
                this.collectMultipleFilters(searchPath, remainingFilters, collectedFilters);
                break;
        }
    }

    parseDate(dateStr) {
        const parts = dateStr.split('.');
        if (parts.length !== 3) throw new Error('Неверный формат даты');
        
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1;
        const year = parseInt(parts[2]);
        
        return new Date(year, month, day);
    }

    async performFilteredSearch(searchPath, filters) {
        try {
            const progressContent = `
Сканируем файлы...`;
            console.log(this.createContainer(progressContent, '🔍 АНАЛИЗ'));
            
            const allFiles = await this.getAllFiles(searchPath);
            console.log(this.createContainer(`\nНайдено файлов: ${allFiles.length}\nПрименяем фильтры...\n`, '📊 СТАТИСТИКА'));
            
            const results = [];
            
            const filterPromises = allFiles.map(async (filePath, index) => {
                try {
                    const stats = await fs.stat(filePath);
                    
                    if (!stats.isFile()) return;
                    
                    let passesFilter = true;
                    const fileName = path.basename(filePath);
                    
                    if (filters.dateFrom && filters.dateTo) {
                        const fileDate = stats.mtime;
                        if (fileDate < filters.dateFrom || fileDate > filters.dateTo) {
                            passesFilter = false;
                        }
                    }
                    
                    if (filters.nameContains && passesFilter) {
                        if (!fileName.toLowerCase().includes(filters.nameContains.toLowerCase())) {
                            passesFilter = false;
                        }
                    }
                    
                    if (filters.contentContains && passesFilter) {
                        const ext = path.extname(filePath).toLowerCase();
                        if (TEXT_FILE_TYPES.includes(ext) && stats.size <= 10 * 1024 * 1024) {
                            try {
                                const content = await fs.readFile(filePath, 'utf-8');
                                if (!content.toLowerCase().includes(filters.contentContains.toLowerCase())) {
                                    passesFilter = false;
                                }
                            } catch {
                                passesFilter = false;
                            }
                        } else {
                            passesFilter = false;
                        }
                    }
                    
                    if (passesFilter) {
                        results.push({
                            path: filePath,
                            name: fileName,
                            size: this.formatFileSize(stats.size),
                            modified: stats.mtime.toLocaleString('ru-RU', { 
                                timeZone: 'Europe/Moscow',
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })
                        });
                    }
                    
                    if (index % 50 === 0 || index === allFiles.length - 1) {
                        this.showProgressBar(index + 1, allFiles.length, `(${index + 1}/${allFiles.length})`);
                    }
                } catch (error) {
                }
            });
            
            await Promise.all(filterPromises);
            
            console.log('\n');
            this.displayFilteredSearchResults(results, filters);
            
            console.log(this.centerText('\nНажмите Enter для возврата...'));
            this.rl.once('line', () => this.showFilterSearchMenu());
            
        } catch (error) {
            console.log(this.centerText(`❌ Ошибка при поиске: ${error.message}`));
            console.log(this.centerText('\nНажмите Enter для возврата...'));
            this.rl.once('line', () => this.showFilterSearchMenu());
        }
    }

    displayFilteredSearchResults(results, filters) {
        this.clearWithTitle();
        
        let filtersInfo = '';
        if (filters.dateFrom && filters.dateTo) {
            filtersInfo += `📅 Дата: ${filters.dateFrom.toLocaleDateString('ru-RU')} - ${filters.dateTo.toLocaleDateString('ru-RU')}\n`;
        }
        if (filters.nameContains) {
            filtersInfo += `📝 Название содержит: "${filters.nameContains}"\n`;
        }
        if (filters.contentContains) {
            filtersInfo += `📄 Содержимое включает: "${filters.contentContains}"\n`;
        }
        
        const headerContent = `
Примененные фильтры:
${filtersInfo}
Найдено совпадений: ${results.length}`;
        
        console.log(this.createContainer(headerContent, '🎯 РЕЗУЛЬТАТЫ ФИЛЬТРОВАННОГО ПОИСКА'));
        
        if (results.length === 0) {
            const noResultsContent = `
Файлы, соответствующие критериям, не найдены!
Попробуйте изменить фильтры.`;
            console.log(this.createContainer(noResultsContent, '❌ НЕТ РЕЗУЛЬТАТОВ'));
            return;
        }
        
        results.forEach((result, index) => {
            const resultContent = `
${index + 1}. 📄 ${result.name}
   📁 ${result.path}
   📏 Размер: ${result.size} | 📅 ${result.modified}`;
            
            console.log(this.createContainer(resultContent, `ФАЙЛ ${index + 1}`));
        });
    }

    searchByName() {
        const nameContent = `
Путь к папке для поиска:`;
        
        console.log(this.createContainer(nameContent, '🔍 ПОИСК ПО ИМЕНИ'));
        process.stdout.write(RED + ' '.repeat(Math.max(0, Math.floor((process.stdout.columns - 2) / 2))) + '> ' + RESET);
        
        this.rl.once('line', (inputPath) => {
            const searchPath = path.resolve(this.expandMacOSPath(inputPath.trim()));
            
            const queryContent = `
Что ищем? (имя файла или часть имени):`;
            console.log(this.createContainer(queryContent, '🎯 ПОИСКОВЫЙ ЗАПРОС'));
            process.stdout.write(RED + ' '.repeat(Math.max(0, Math.floor((process.stdout.columns - 2) / 2))) + '> ' + RESET);
            
            this.rl.once('line', async (searchQuery) => {
                try {
                    await fs.access(searchPath);
                    const stats = await fs.stat(searchPath);
                    
                    if (!stats.isDirectory()) {
                        const errorContent = `
Указанный путь не является папкой!`;
                        console.log(this.createContainer(errorContent, '❌ ОШИБКА'));
                        console.log(this.centerText('\nНажмите Enter для повтора...'));
                        this.rl.once('line', () => this.searchByName());
                        return;
                    }
                    
                    await this.performNameSearch(searchPath, searchQuery.trim());
                    
                } catch (error) {
                    const errorContent = `
Ошибка: ${error.message}`;
                    console.log(this.createContainer(errorContent, '❌ ОШИБКА'));
                    console.log(this.centerText('\nНажмите Enter для повтора...'));
                    this.rl.once('line', () => this.searchByName());
                }
            });
        });
    }

    searchByContent() {
        const contentContent = `
Путь к папке для поиска:`;
        
        console.log(this.createContainer(contentContent, '📄 ПОИСК ПО СОДЕРЖИМОМУ'));
        process.stdout.write(RED + ' '.repeat(Math.max(0, Math.floor((process.stdout.columns - 2) / 2))) + '> ' + RESET);
        
        this.rl.once('line', (inputPath) => {
            const searchPath = path.resolve(this.expandMacOSPath(inputPath.trim()));
            
            const queryContent = `
Какую строку ищем в файлах?`;
            console.log(this.createContainer(queryContent, '🔍 ТЕКСТ ДЛЯ ПОИСКА'));
            process.stdout.write(RED + ' '.repeat(Math.max(0, Math.floor((process.stdout.columns - 2) / 2))) + '> ' + RESET);
            
            this.rl.once('line', async (searchQuery) => {
                try {
                    await fs.access(searchPath);
                    const stats = await fs.stat(searchPath);
                    
                    if (!stats.isDirectory()) {
                        const errorContent = `
Указанный путь не является папкой!`;
                        console.log(this.createContainer(errorContent, '❌ ОШИБКА'));
                        console.log(this.centerText('\nНажмите Enter для повтора...'));
                        this.rl.once('line', () => this.searchByContent());
                        return;
                    }
                    
                    await this.performContentSearch(searchPath, searchQuery.trim());
                    
                } catch (error) {
                    const errorContent = `
Ошибка: ${error.message}`;
                    console.log(this.createContainer(errorContent, '❌ ОШИБКА'));
                    console.log(this.centerText('\nНажмите Enter для повтора...'));
                    this.rl.once('line', () => this.searchByContent());
                }
            });
        });
    }

    async performNameSearch(searchPath, query) {
        try {
            const progressContent = `
Сканируем файлы...`;
            console.log(this.createContainer(progressContent, '🔍 ПРОЦЕСС ПОИСКА'));
            
            const allFiles = await this.getAllFiles(searchPath);
            
            const statsContent = `
Найдено файлов: ${allFiles.length}
Ищем совпадения...`;
            console.log(this.createContainer(statsContent, '📊 СТАТИСТИКА'));
            
            const results = [];
            const queryLower = query.toLowerCase();
            
            const searchPromises = allFiles.map(async (filePath, index) => {
                try {
                    const fileName = path.basename(filePath).toLowerCase();
                    
                    if (this.binaryStringSearch(fileName, queryLower)) {
                        const stats = await fs.stat(filePath);
                        results.push({
                            path: filePath,
                            name: path.basename(filePath),
                            size: this.formatFileSize(stats.size),
                            modified: stats.mtime.toLocaleString('ru-RU', { 
                                timeZone: 'Europe/Moscow',
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })
                        });
                    }
                    
                    if (index % 50 === 0 || index === allFiles.length - 1) {
                        this.showProgressBar(index + 1, allFiles.length, `(${index + 1}/${allFiles.length})`);
                    }
                } catch (error) {
                }
            });
            
            await Promise.all(searchPromises);
            
            console.log('\n');
            this.displayNameSearchResults(results, query);
            
            console.log(this.centerText('\nНажмите Enter для возврата...'));
            this.rl.once('line', () => this.showSearchMenu());
            
        } catch (error) {
            const errorContent = `
Ошибка при поиске: ${error.message}`;
            console.log(this.createContainer(errorContent, '❌ ОШИБКА'));
            console.log(this.centerText('\nНажмите Enter для возврата...'));
            this.rl.once('line', () => this.showSearchMenu());
        }
    }

    async performContentSearch(searchPath, query) {
        try {
            const progressContent = `
Сканируем файлы...`;
            console.log(this.createContainer(progressContent, '🔍 ПРОЦЕСС ПОИСКА'));
            
            const allFiles = await this.getAllFiles(searchPath);
            
            const textFiles = allFiles.filter(filePath => {
                const ext = path.extname(filePath).toLowerCase();
                return TEXT_FILE_TYPES.includes(ext);
            });
            
            const statsContent = `
Всего файлов: ${allFiles.length}
Текстовых файлов: ${textFiles.length}
Ищем в содержимом...`;
            console.log(this.createContainer(statsContent, '📊 СТАТИСТИКА'));
            
            const results = [];
            const queryLower = query.toLowerCase();
            
            const searchPromises = textFiles.map(async (filePath, index) => {
                try {
                    const stats = await fs.stat(filePath);
                    
                    if (stats.size > 10 * 1024 * 1024) {
                        return;
                    }
                    
                    const content = await fs.readFile(filePath, 'utf-8');
                    const contentLower = content.toLowerCase();
                    
                    const matches = this.findAllMatches(contentLower, queryLower, content);
                    
                    if (matches.length > 0) {
                        results.push({
                            path: filePath,
                            name: path.basename(filePath),
                            size: this.formatFileSize(stats.size),
                            modified: stats.mtime.toLocaleString('ru-RU', { 
                                timeZone: 'Europe/Moscow',
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            }),
                            matches: matches
                        });
                    }
                    
                    if (index % 10 === 0 || index === textFiles.length - 1) {
                        this.showProgressBar(index + 1, textFiles.length, `(${index + 1}/${textFiles.length})`);
                    }
                } catch (error) {
                }
            });
            
            await Promise.all(searchPromises);
            
            console.log('\n');
            this.displayContentSearchResults(results, query);
            
            console.log(this.centerText('\nНажмите Enter для возврата...'));
            this.rl.once('line', () => this.showSearchMenu());
            
        } catch (error) {
            const errorContent = `
Ошибка при поиске: ${error.message}`;
            console.log(this.createContainer(errorContent, '❌ ОШИБКА'));
            console.log(this.centerText('\nНажмите Enter для возврата...'));
            this.rl.once('line', () => this.showSearchMenu());
        }
    }

    binaryStringSearch(text, pattern) {
        if (!pattern || pattern.length === 0) return false;
        if (pattern.length > text.length) return false;
        return text.includes(pattern);
    }

    findAllMatches(lowerText, lowerPattern, originalText) {
        const matches = [];
        let index = 0;
        const contextLength = 50;
        
        while ((index = lowerText.indexOf(lowerPattern, index)) !== -1) {
            const start = Math.max(0, index - contextLength);
            const end = Math.min(originalText.length, index + lowerPattern.length + contextLength);
            
            let context = originalText.substring(start, end);
            
            if (start > 0) context = '...' + context;
            if (end < originalText.length) context = context + '...';
            
            const lineNumber = originalText.substring(0, index).split('\n').length;
            
            matches.push({
                line: lineNumber,
                context: context.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()
            });
            
            index += lowerPattern.length;
            
            if (matches.length >= 5) break;
        }
        
        return matches;
    }

    displayNameSearchResults(results, query) {
        this.clearWithTitle();
        
        const headerContent = `
Поисковый запрос: "${query}"
Найдено совпадений: ${results.length}`;
        
        console.log(this.createContainer(headerContent, '🔍 РЕЗУЛЬТАТЫ ПОИСКА ПО ИМЕНИ'));
        
        if (results.length === 0) {
            const noResultsContent = `
Файлы не найдены!
Попробуйте изменить поисковый запрос.`;
            console.log(this.createContainer(noResultsContent, '❌ НЕТ РЕЗУЛЬТАТОВ'));
            return;
        }
        
        results.forEach((result, index) => {
            const resultContent = `
📄 ${result.name}
📁 ${result.path}
📏 Размер: ${result.size}
📅 Изменен: ${result.modified}`;
            
            console.log(this.createContainer(resultContent, `ФАЙЛ ${index + 1}`));
        });
    }

    displayContentSearchResults(results, query) {
        this.clearWithTitle();
        
        const headerContent = `
Поисковый запрос: "${query}"
Найдено файлов: ${results.length}`;
        
        console.log(this.createContainer(headerContent, '🔍 РЕЗУЛЬТАТЫ ПОИСКА ПО СОДЕРЖИМОМУ'));
        
        if (results.length === 0) {
            const noResultsContent = `
Совпадения не найдены!
Поиск выполняется только в текстовых файлах.
Попробуйте изменить поисковый запрос.`;
            console.log(this.createContainer(noResultsContent, '❌ НЕТ РЕЗУЛЬТАТОВ'));
            return;
        }
        
        results.forEach((result, index) => {
            let matchesText = '';
            result.matches.forEach((match, matchIndex) => {
                matchesText += `${matchIndex + 1}. Строка ${match.line}: ${match.context}\n`;
            });
            
            const resultContent = `
📄 ${result.name}
📁 ${result.path}
📏 ${result.size} | 📅 ${result.modified}
🎯 Совпадений: ${result.matches.length}

${matchesText}`;
            
            console.log(this.createContainer(resultContent, `ФАЙЛ ${index + 1}`));
        });
    }

    showAnalysisMenu() {
        const analysisContent = `
[1] Анализ папки
[0] В главное меню`;
        
        console.log(this.createContainer(analysisContent, '📊 АНАЛИЗ'));
        
        process.stdout.write(RED + '\n' + ' '.repeat(Math.max(0, Math.floor((process.stdout.columns - 'Выберите опцию: '.length) / 2))) + 'Выберите опцию: ' + RESET);
        
        this.rl.once('line', (answer) => {
            switch(answer.trim()) {
                case '1':
                    this.analyzeFolderPrompt();
                    break;
                case '0':
                    this.showMainMenu();
                    break;
                default:
                    console.log(this.centerText('Неверная опция. Попробуйте снова.'));
                    setTimeout(() => this.showAnalysisMenu(), 1500);
                    break;
            }
        });
    }

    analyzeFolderPrompt() {
        const folderContent = `
Полный путь к папке:`;
        
        console.log(this.createContainer(folderContent, '📁 АНАЛИЗ ПАПКИ'));
        process.stdout.write(RED + ' '.repeat(Math.max(0, Math.floor((process.stdout.columns - 2) / 2))) + '> ' + RESET);
        
        this.rl.once('line', async (inputPath) => {
            const folderPath = path.resolve(this.expandMacOSPath(inputPath.trim()));
            
            try {
                await fs.access(folderPath);
                const stats = await fs.stat(folderPath);
                
                if (!stats.isDirectory()) {
                    const errorContent = `
Указанный путь не является папкой!`;
                    console.log(this.createContainer(errorContent, '❌ ОШИБКА'));
                    console.log(this.centerText('\nНажмите Enter для повтора...'));
                    this.rl.once('line', () => this.analyzeFolderPrompt());
                    return;
                }
                
                await this.performFolderAnalysis(folderPath);
                
            } catch (error) {
                const errorContent = `
Ошибка: ${error.message}`;
                console.log(this.createContainer(errorContent, '❌ ОШИБКА'));
                console.log(this.centerText('\nНажмите Enter для повтора...'));
                this.rl.once('line', () => this.analyzeFolderPrompt());
            }
        });
    }

    async performFolderAnalysis(folderPath) {
        try {
            const progressContent = `
Сканируем папку...`;
            console.log(this.createContainer(progressContent, '🔍 ПРОЦЕСС АНАЛИЗА'));
            
            const allFiles = await this.getAllFiles(folderPath);
            
            const statsContent = `
Найдено файлов: ${allFiles.length}
Анализируем файлы...`;
            console.log(this.createContainer(statsContent, '📊 СТАТИСТИКА'));
            
            const analysis = {
                totalFiles: 0,
                totalSize: 0,
                typeStats: {},
                sizeStats: {}
            };
            
            Object.keys(FILE_TYPES).forEach(type => {
                analysis.typeStats[type] = 0;
                analysis.sizeStats[type] = 0;
            });
            analysis.typeStats['Other'] = 0;
            analysis.sizeStats['Other'] = 0;
            
            const analyzePromises = allFiles.map(async (filePath, index) => {
                try {
                    const stats = await fs.stat(filePath);
                    
                    if (stats.isFile()) {
                        const fileExt = path.extname(filePath).toLowerCase();
                        const fileName = path.basename(filePath, fileExt).toLowerCase();
                        let fileType = 'Other';
                        
                        for (const [typeName, extensions] of Object.entries(FILE_TYPES)) {
                            if (extensions.includes(fileExt)) {
                                fileType = typeName;
                                break;
                            }
                            
                            if (typeName === 'Installers' && fileName.includes('install')) {
                                fileType = 'Installers';
                                break;
                            }
                        }
                        
                        analysis.totalFiles++;
                        analysis.totalSize += stats.size;
                        analysis.typeStats[fileType]++;
                        analysis.sizeStats[fileType] += stats.size;
                        
                        if (index % 10 === 0 || index === allFiles.length - 1) {
                            this.showProgressBar(index + 1, allFiles.length, `(${index + 1}/${allFiles.length})`);
                        }
                    }
                } catch (error) {
                }
            });
            
            await Promise.all(analyzePromises);
            
            console.log('\n');
            this.displayAnalysisResults(analysis, folderPath);
            
            console.log(this.centerText('\nНажмите Enter для возврата...'));
            this.rl.once('line', () => this.showAnalysisMenu());
            
        } catch (error) {
            const errorContent = `
Ошибка при анализе: ${error.message}`;
            console.log(this.createContainer(errorContent, '❌ ОШИБКА'));
            console.log(this.centerText('\nНажмите Enter для возврата...'));
            this.rl.once('line', () => this.showAnalysisMenu());
        }
    }

    displayAnalysisResults(analysis, folderPath) {
        this.clearWithTitle();
        
        const headerContent = `
Папка: ${path.basename(folderPath)}
Всего файлов: ${analysis.totalFiles}
Общий размер: ${this.formatFileSize(analysis.totalSize)}`;
        
        console.log(this.createContainer(headerContent, '📊 РЕЗУЛЬТАТЫ АНАЛИЗА ПАПКИ'));
        
        const sortedTypes = Object.entries(analysis.typeStats)
            .filter(([type, count]) => count > 0)
            .sort((a, b) => b[1] - a[1]);
        
        let typesContent = 'СТАТИСТИКА ПО ТИПАМ ФАЙЛОВ:\n\n';
        sortedTypes.forEach(([type, count]) => {
            const size = this.formatFileSize(analysis.sizeStats[type]);
            const emoji = this.getTypeEmoji(type);
            typesContent += `${emoji} ${type}: ${count} файл(ов) - ${size}\n`;
        });
        
        console.log(this.createContainer(typesContent, '📋 ТИПЫ ФАЙЛОВ'));
        
        const sortedBySize = Object.entries(analysis.sizeStats)
            .filter(([type, size]) => size > 0)
            .sort((a, b) => b[1] - a[1]);
        
        let sizesContent = 'РАСПРЕДЕЛЕНИЕ ПО РАЗМЕРУ:\n\n';
        sortedBySize.forEach(([type, size]) => {
            const percentage = ((size / analysis.totalSize) * 100).toFixed(1);
            const emoji = this.getTypeEmoji(type);
            sizesContent += `${emoji} ${type}: ${this.formatFileSize(size)} (${percentage}%)\n`;
        });
        
        console.log(this.createContainer(sizesContent, '💽 РАЗМЕРЫ'));
    }

    getTypeEmoji(type) {
        const emojis = {
            'Images': '🖼️',
            'Video': '🎥',
            'Audio': '🎵',
            'Programs': '🍎',
            'Installers': '📦',
            'Docx': '📄',
            'ZIP': '🗜️',
            'Code': '💻',
            'Scripts': '📜',
            'Other': '❓'
        };
        return emojis[type] || '📁';
    }

    async getAllFiles(dirPath, fileList = []) {
        try {
            const files = await fs.readdir(dirPath);
            
            const promises = files.map(async (file) => {
                if (file.startsWith('.') && file !== '.') {
                    return;
                }
                
                const filePath = path.join(dirPath, file);
                try {
                    const stats = await fs.stat(filePath);
                    
                    if (stats.isDirectory()) {
                        await this.getAllFiles(filePath, fileList);
                    } else {
                        fileList.push(filePath);
                    }
                } catch (error) {
                }
            });
            
            await Promise.all(promises);
        } catch (error) {
        }
        
        return fileList;
    }

    formatFileSize(bytes) {
        const sizes = ['Байт', 'КБ', 'МБ', 'ГБ', 'ТБ'];
        if (bytes === 0) return '0 Байт';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }

    showMediaMenu() {
        const mediaContent = `
[1] Извлечение метаданных
[0] В главное меню`;
        
        console.log(this.createContainer(mediaContent, '🎵 МЕДИА'));
        
        process.stdout.write(RED + '\n' + ' '.repeat(Math.max(0, Math.floor((process.stdout.columns - 'Выберите опцию: '.length) / 2))) + 'Выберите опцию: ' + RESET);
        
        this.rl.once('line', (answer) => {
            switch(answer.trim()) {
                case '1':
                    this.showMetadataMenu();
                    break;
                case '0':
                    this.showMainMenu();
                    break;
                default:
                    console.log(this.centerText('Неверная опция. Попробуйте снова.'));
                    setTimeout(() => this.showMediaMenu(), 1500);
                    break;
            }
        });
    }

    showMetadataMenu() {
        const metadataContent = `
[1] EXIF из фото
[2] Теги из MP3
[0] Назад`;
        
        console.log(this.createContainer(metadataContent, '🔍 ИЗВЛЕЧЕНИЕ МЕТАДАННЫХ'));
        
        process.stdout.write(RED + '\n' + ' '.repeat(Math.max(0, Math.floor((process.stdout.columns - 'Выберите опцию: '.length) / 2))) + 'Выберите опцию: ' + RESET);
        
        this.rl.once('line', (answer) => {
            switch(answer.trim()) {
                case '1':
                    this.extractExifData();
                    break;
                case '2':
                    this.extractMp3Tags();
                    break;
                case '0':
                    this.showMediaMenu();
                    break;
                default:
                    console.log(this.centerText('Неверная опция. Попробуйте снова.'));
                    setTimeout(() => this.showMetadataMenu(), 1500);
                    break;
            }
        });
    }

    extractExifData() {
        const exifContent = `
Полный путь к файлу:`;
        
        console.log(this.createContainer(exifContent, '📸 EXIF ИЗ ФОТО'));
        process.stdout.write(RED + ' '.repeat(Math.max(0, Math.floor((process.stdout.columns - 2) / 2))) + '> ' + RESET);
        
        this.rl.once('line', async (inputPath) => {
            const filePath = path.resolve(this.expandMacOSPath(inputPath.trim()));
            
            try {
                await fs.access(filePath);
                
                const fileExt = path.extname(filePath).toLowerCase();
                const imageExtensions = ['.jpg', '.jpeg', '.tiff', '.tif', '.heic', '.heif'];
                
                if (!imageExtensions.includes(fileExt)) {
                    const errorContent = `
Это не поддерживаемый формат изображения!
Поддерживаемые форматы: .jpg, .jpeg, .tiff, .tif, .heic, .heif`;
                    console.log(this.createContainer(errorContent, '❌ ОШИБКА'));
                } else {
                    const progressContent = `
Извлекаем EXIF данные...`;
                    console.log(this.createContainer(progressContent, '🔍 ОБРАБОТКА'));
                    const exifData = await this.readExifData(filePath);
                    this.displayExifData(exifData, filePath);
                }
                
                console.log(this.centerText('\nНажмите Enter для возврата...'));
                this.rl.once('line', () => {
                    this.showMetadataMenu();
                });
                
            } catch (error) {
                const errorContent = `
Ошибка: ${error.message}`;
                console.log(this.createContainer(errorContent, '❌ ОШИБКА'));
                console.log(this.centerText('\nНажмите Enter для повтора...'));
                
                this.rl.once('line', () => {
                    this.extractExifData();
                });
            }
        });
    }

    extractMp3Tags() {
        const mp3Content = `
Полный путь к файлу:`;
        
        console.log(this.createContainer(mp3Content, '🎵 ТЕГИ ИЗ MP3'));
        process.stdout.write(RED + ' '.repeat(Math.max(0, Math.floor((process.stdout.columns - 2) / 2))) + '> ' + RESET);
        
        this.rl.once('line', async (inputPath) => {
            const filePath = path.resolve(this.expandMacOSPath(inputPath.trim()));
            
            try {
                await fs.access(filePath);
                
                const fileExt = path.extname(filePath).toLowerCase();
                
                if (fileExt !== '.mp3') {
                    const errorContent = `
Это не MP3 файл!`;
                    console.log(this.createContainer(errorContent, '❌ ОШИБКА'));
                } else {
                    const progressContent = `
Извлекаем ID3 теги...`;
                    console.log(this.createContainer(progressContent, '🔍 ОБРАБОТКА'));
                    const mp3Tags = await this.readMp3Tags(filePath);
                    this.displayMp3Tags(mp3Tags, filePath);
                }
                
                console.log(this.centerText('\nНажмите Enter для возврата...'));
                this.rl.once('line', () => {
                    this.showMetadataMenu();
                });
                
            } catch (error) {
                const errorContent = `
Ошибка: ${error.message}`;
                console.log(this.createContainer(errorContent, '❌ ОШИБКА'));
                console.log(this.centerText('\nНажмите Enter для повтора...'));
                
                this.rl.once('line', () => {
                    this.extractMp3Tags();
                });
            }
        });
    }

    async readExifData(filePath) {
        try {
            const buffer = await fs.readFile(filePath);
            const stats = await fs.stat(filePath);
            
            const basicInfo = {
                fileName: path.basename(filePath),
                fileSize: this.formatFileSize(stats.size),
                dateCreated: stats.birthtime.toLocaleString('ru-RU', { 
                    timeZone: 'Europe/Moscow',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                dateModified: stats.mtime.toLocaleString('ru-RU', { 
                    timeZone: 'Europe/Moscow',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                dimensions: 'Не удалось определить',
                camera: 'Не найдено',
                dateTime: 'Не найдено'
            };

            if (buffer.length > 20) {
                const exifMarker = buffer.indexOf(Buffer.from('Exif', 'ascii'));
                if (exifMarker !== -1) {
                    basicInfo.hasExif = 'Да - EXIF данные найдены';
                    
                    const cameraMarkers = ['Canon', 'Nikon', 'Sony', 'Apple', 'Samsung', 'iPhone', 'iPad'];
                    for (const marker of cameraMarkers) {
                        if (buffer.includes(Buffer.from(marker, 'ascii'))) {
                            basicInfo.camera = `${marker} (обнаружен)`;
                            break;
                        }
                    }
                } else {
                    basicInfo.hasExif = 'Нет - EXIF данные не найдены';
                }
            }

            return basicInfo;
        } catch (error) {
            throw new Error(`Не удалось прочитать EXIF данные: ${error.message}`);
        }
    }

    async readMp3Tags(filePath) {
        try {
            const buffer = await fs.readFile(filePath);
            const stats = await fs.stat(filePath);
            
            const tags = {
                fileName: path.basename(filePath),
                fileSize: this.formatFileSize(stats.size),
                title: 'Не найдено',
                artist: 'Не найдено',
                album: 'Не найдено',
                year: 'Не найдено',
                genre: 'Не найдено',
                duration: 'Не удалось определить'
            };

            if (buffer.length >= 128) {
                const id3v1 = buffer.slice(-128);
                if (id3v1.toString('ascii', 0, 3) === 'TAG') {
                    tags.title = this.cleanString(id3v1.toString('ascii', 3, 33));
                    tags.artist = this.cleanString(id3v1.toString('ascii', 33, 63));
                    tags.album = this.cleanString(id3v1.toString('ascii', 63, 93));
                    tags.year = this.cleanString(id3v1.toString('ascii', 93, 97));
                }
            }

            if (buffer.length >= 10 && buffer.toString('ascii', 0, 3) === 'ID3') {
                tags.hasID3v2 = 'Да - ID3v2 теги найдены';
                
                const titleMatch = this.findID3v2Tag(buffer, 'TIT2');
                const artistMatch = this.findID3v2Tag(buffer, 'TPE1');
                const albumMatch = this.findID3v2Tag(buffer, 'TALB');
                
                if (titleMatch) tags.title = titleMatch;
                if (artistMatch) tags.artist = artistMatch;
                if (albumMatch) tags.album = albumMatch;
            }

            return tags;
        } catch (error) {
            throw new Error(`Не удалось прочитать MP3 теги: ${error.message}`);
        }
    }

    findID3v2Tag(buffer, tagName) {
        const tagBuffer = Buffer.from(tagName, 'ascii');
        const index = buffer.indexOf(tagBuffer);
        
        if (index !== -1 && index + 10 < buffer.length) {
            const start = index + 10;
            const end = Math.min(start + 100, buffer.length);
            const tagData = buffer.slice(start, end);
            
            return this.cleanString(tagData.toString('utf8').replace(/\0/g, ''));
        }
        
        return null;
    }

    cleanString(str) {
        return str.replace(/\0/g, '').trim() || 'Не найдено';
    }

    displayExifData(exifData, filePath) {
        this.clearWithTitle();
        
        const exifContent = `
Файл: ${exifData.fileName}
Размер: ${exifData.fileSize}
Создан: ${exifData.dateCreated}
Изменен: ${exifData.dateModified}
Размеры: ${exifData.dimensions}
Камера: ${exifData.camera}
EXIF: ${exifData.hasExif || 'Проверка не выполнена'}`;
        
        console.log(this.createContainer(exifContent, '📸 EXIF ДАННЫЕ ИЗОБРАЖЕНИЯ'));
    }

    displayMp3Tags(tags, filePath) {
        this.clearWithTitle();
        
        const tagsContent = `
Файл: ${tags.fileName}
Размер: ${tags.fileSize}
Название: ${tags.title}
Исполнитель: ${tags.artist}
Альбом: ${tags.album}
Год: ${tags.year}
Жанр: ${tags.genre}
Длительность: ${tags.duration}
ID3v2: ${tags.hasID3v2 || 'Не найдено'}`;
        
        console.log(this.createContainer(tagsContent, '🎵 ID3 ТЕГИ MP3 ФАЙЛА'));
    }

    showSortMenu() {
        const sortContent = `
[1] По типам
[0] Назад`;
        
        console.log(this.createContainer(sortContent, '📁 СОРТИРОВКА'));
        
        process.stdout.write(RED + '\n' + ' '.repeat(Math.max(0, Math.floor((process.stdout.columns - 'Выберите опцию: '.length) / 2))) + 'Выберите опцию: ' + RESET);
        
        this.rl.once('line', (answer) => {
            switch(answer.trim()) {
                case '1':
                    this.sortByTypes();
                    break;
                case '0':
                    this.showMainMenu();
                    break;
                default:
                    console.log(this.centerText('Неверная опция. Попробуйте снова.'));
                    setTimeout(() => this.showSortMenu(), 1500);
                    break;
            }
        });
    }

    sortByTypes() {
        const sortContent = `
Укажите путь:`;
        
        console.log(this.createContainer(sortContent, '📁 СОРТИРОВКА ПО ТИПАМ'));
        process.stdout.write(RED + ' '.repeat(Math.max(0, Math.floor((process.stdout.columns - 2) / 2))) + '> ' + RESET);
        
        this.rl.once('line', async (inputPath) => {
            const targetPath = path.resolve(this.expandMacOSPath(inputPath.trim()));
            
            try {
                await fs.access(targetPath);
                
                const startContent = `
Начинаем сортировку в: ${targetPath}
Процесс сортировки...`;
                console.log(this.createContainer(startContent, '🔄 ПРОЦЕСС СОРТИРОВКИ'));
                
                await this.performSort(targetPath);
                
                const successContent = `
Сортировка завершена успешно!`;
                console.log(this.createContainer(successContent, '✅ ЗАВЕРШЕНО'));
                console.log(this.centerText('\nНажмите Enter для возврата в главное меню...'));
                
                this.rl.once('line', () => {
                    this.showMainMenu();
                });
                
            } catch (error) {
                const errorContent = `
Ошибка: ${error.message}`;
                console.log(this.createContainer(errorContent, '❌ ОШИБКА'));
                console.log(this.centerText('\nНажмите Enter для повтора...'));
                
                this.rl.once('line', () => {
                    this.sortByTypes();
                });
            }
        });
    }

    async performSort(targetPath) {
        try {
            const files = await fs.readdir(targetPath);
            
            const createFolderPromises = Object.keys(FILE_TYPES).map(async (folderName) => {
                const folderPath = path.join(targetPath, folderName);
                try {
                    await fs.mkdir(folderPath, { recursive: true });
                } catch (error) {
                }
            });
            
            await Promise.all(createFolderPromises);
            
            const sortPromises = files.map(async (file) => {
                if (file.startsWith('.')) return;
                
                const filePath = path.join(targetPath, file);
                
                try {
                    const stats = await fs.stat(filePath);
                    
                    if (stats.isDirectory()) {
                        return;
                    }
                    
                    const fileExt = path.extname(file).toLowerCase();
                    const fileName = path.basename(file, fileExt).toLowerCase();
                    
                    let targetFolder = null;
                    
                    for (const [folderName, extensions] of Object.entries(FILE_TYPES)) {
                        if (extensions.includes(fileExt)) {
                            targetFolder = folderName;
                            break;
                        }
                        
                        if (folderName === 'Installers' && (fileName.includes('install') || fileName.includes('setup'))) {
                            targetFolder = 'Installers';
                            break;
                        }
                    }
                    
                    if (targetFolder) {
                        const newPath = path.join(targetPath, targetFolder, file);
                        
                        try {
                            await fs.access(newPath);
                            console.log(this.centerText(`⚠️  Файл ${file} уже существует в папке ${targetFolder}, пропускаем`));
                        } catch {
                            await fs.rename(filePath, newPath);
                            console.log(this.centerText(`📁 ${file} → ${targetFolder}/`));
                        }
                    } else {
                        console.log(this.centerText(`❓ ${file} - неизвестный тип файла, оставляем на месте`));
                    }
                    
                } catch (error) {
                    console.log(this.centerText(`❌ Ошибка при обработке файла ${file}: ${error.message}`));
                }
            });
            
            await Promise.all(sortPromises);
            
        } catch (error) {
            throw new Error(`Не удалось отсортировать файлы: ${error.message}`);
        }
    }

    start() {
        this.showMainMenu();
    }

    close() {
        this.rl.close();
    }
}

const app = new FileGodMacOS();

process.on('SIGINT', () => {
    console.log(RED + '\n\n🍎 До свидания! 🍎' + RESET);
    app.close();
    process.exit(0);
});

app.start();
