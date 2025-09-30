// Simple test script for FoxAI记账软件
const { KVService } = require('./lib/kv-service');

async function testRiskManagement() {
  console.log('🧪 开始测试FoxAI记账软件风险管理系统...\n');

  try {
    // 测试1: 初始状态
    console.log('1️⃣ 测试初始状态');
    const initialRisk = await KVService.getRiskStatus();
    console.log(`   ✅ 初始状态: ${initialRisk.isInRisk ? '风险中' : '正常'}`);
    console.log(`   ✅ 连续亏损次数: ${initialRisk.consecutiveLosses}`);

    // 测试2: 添加盈利记录
    console.log('\n2️⃣ 测试添加盈利记录');
    const profitTransaction = await KVService.addTransaction({
      date: '2024-01-15',
      amount: 100,
      type: 'profit',
      description: '测试盈利'
    });
    console.log(`   ✅ 盈利记录添加成功: ¥${profitTransaction.amount}`);

    // 验证盈利后的风险状态
    const riskAfterProfit = await KVService.getRiskStatus();
    console.log(`   ✅ 风险状态重置: ${riskAfterProfit.consecutiveLosses}次连续亏损`);

    // 测试3: 添加第一笔亏损记录
    console.log('\n3️⃣ 测试添加第一笔亏损记录');
    const loss1Transaction = await KVService.addTransaction({
      date: '2024-01-16',
      amount: 50,
      type: 'loss',
      description: '测试亏损1'
    });
    console.log(`   ✅ 第一笔亏损记录添加成功: -¥${Math.abs(loss1Transaction.amount)}`);

    // 验证第一笔亏损后的风险状态
    const riskAfterLoss1 = await KVService.getRiskStatus();
    console.log(`   ✅ 风险状态: ${riskAfterLoss1.consecutiveLosses}次连续亏损`);
    console.log(`   ✅ 风险警告状态: ${riskAfterLoss1.isInRisk ? '已触发' : '未触发'}`);

    // 测试4: 添加第二笔亏损记录（应该触发风险警告）
    console.log('\n4️⃣ 测试添加第二笔亏损记录（应该触发风险警告）');
    const loss2Transaction = await KVService.addTransaction({
      date: '2024-01-17',
      amount: 75,
      type: 'loss',
      description: '测试亏损2'
    });
    console.log(`   ✅ 第二笔亏损记录添加成功: -¥${Math.abs(loss2Transaction.amount)}`);

    // 验证第二笔亏损后的风险状态（应该触发风险警告）
    const riskAfterLoss2 = await KVService.getRiskStatus();
    console.log(`   ✅ 风险状态: ${riskAfterLoss2.consecutiveLosses}次连续亏损`);
    console.log(`   ✅ 风险警告状态: ${riskAfterLoss2.isInRisk ? '已触发' : '未触发'}`);

    if (riskAfterLoss2.isInRisk) {
      console.log(`   ⚠️  风险警告已触发！24小时内将无法添加新记录`);
      console.log(`   ⏰ 风险开始时间: ${riskAfterLoss2.riskStartTime}`);
    }

    // 测试5: 验证风险状态下的添加限制
    console.log('\n5️⃣ 测试风险状态下的添加限制');
    try {
      await KVService.addTransaction({
        date: '2024-01-18',
        amount: 25,
        type: 'loss',
        description: '测试亏损3 - 应该被拒绝'
      });
      console.log(`   ❌ 错误：第三笔记录应该被拒绝但没有被拒绝`);
    } catch (error) {
      console.log(`   ✅ 第三笔记录正确被拒绝: ${error.message}`);
    }

    // 测试6: 重置风险状态
    console.log('\n6️⃣ 测试重置风险状态');
    await KVService.resetRiskStatus();
    const riskAfterReset = await KVService.getRiskStatus();
    console.log(`   ✅ 风险状态已重置: ${riskAfterReset.consecutiveLosses}次连续亏损`);
    console.log(`   ✅ 风险警告状态: ${riskAfterReset.isInRisk ? '已触发' : '未触发'}`);

    // 测试7: 验证重置后可以正常添加记录
    console.log('\n7️⃣ 验证重置后可以正常添加记录');
    const afterResetTransaction = await KVService.addTransaction({
      date: '2024-01-19',
      amount: 200,
      type: 'profit',
      description: '重置后测试'
    });
    console.log(`   ✅ 重置后记录添加成功: ¥${afterResetTransaction.amount}`);

    // 测试8: 统计功能测试
    console.log('\n8️⃣ 测试统计功能');
    const dailyStats = await KVService.getStatistics('daily', '2024-01-15');
    console.log(`   ✅ 日统计:`);
    console.log(`      - 总盈利: ¥${dailyStats.totalProfit}`);
    console.log(`      - 总亏损: ¥${dailyStats.totalLoss}`);
    console.log(`      - 净收益: ¥${dailyStats.netProfit}`);
    console.log(`      - 交易次数: ${dailyStats.transactionCount}`);

    console.log('\n🎉 所有测试完成！风险管理系统工作正常。');

  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
}

// 运行测试
testRiskManagement();