// src/screens/Wallet/WalletScreen.tsx
import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Modal,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Text } from 'react-native-paper';
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { SolanaWalletClient } from '@/src/services/solanaWallet';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BlurView } from 'expo-blur';
import WalletConnectButton from '@/src/components/Wallet/WalletConnectButton';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/src/store/store';
import { setSolBalance } from '@/src/store/slices/walletSlice';
import { mobileWalletAdapter } from '@/src/utils/mobileWalletAdapter';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function WalletScreen() {
  const dispatch = useDispatch();
  const wallet = useSelector((state: RootState) => state.wallet);

  const [sheetType, setSheetType] = useState<'deposit' | 'withdraw' | null>(null);
  const [amount, setAmount] = useState('');
  const [destination, setDestination] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const solana = useRef(new SolanaWalletClient('devnet')).current;

  // Try to reconnect on mount
  useEffect(() => {
    const tryReconnect = async () => {
      try {
        const reconnected = await mobileWalletAdapter.reconnectIfPossible();
        if (reconnected && wallet.address) {
          await fetchBalance(wallet.address);
        }
      } catch (error) {
        console.log('Auto-reconnect failed:', error);
      }
    };
    tryReconnect();
  }, []);

  const transactions = [
    {
      id: '1',
      type: 'deposit',
      amount: 5000,
      status: 'completed',
      date: '2 hours ago',
    },
    {
      id: '2',
      type: 'withdrawal',
      amount: 2000,
      status: 'pending',
      date: '1 day ago',
    },
    {
      id: '3',
      type: 'win',
      amount: 3500,
      status: 'completed',
      date: '2 days ago',
    },
  ];

  const openSheet = (type: 'deposit' | 'withdraw') => {
    setSheetType(type);
    setAmount('');
    Animated.spring(slideAnim, {
      toValue: 0,
      tension: 65,
      friction: 11,
      useNativeDriver: true,
    }).start();
  };

  const closeSheet = () => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setSheetType(null);
      setAmount('');
    });
  };

  const quickAmounts = [0.1, 0.25, 0.5, 1];

  // Fetch balance and update Redux
  const fetchBalance = useCallback(async (addr: string) => {
    try {
      setIsBusy(true);
      const balanceLamports = await solana.connection.getBalance(new PublicKey(addr));
      const balanceSOL = balanceLamports / LAMPORTS_PER_SOL;

      // Update Redux store
      dispatch(setSolBalance(balanceSOL));

      console.log('[Wallet] Balance (SOL):', balanceSOL.toFixed(6));
      return balanceSOL;
    } catch (e) {
      console.warn('Failed to fetch SOL balance', e);
      throw e;
    } finally {
      setIsBusy(false);
    }
  }, [solana.connection, dispatch]);

  const onConnected = useCallback(async (addr: string) => {
    console.log('[Wallet] Connected address:', addr);
    Alert.alert('Wallet Connected', `Address:\n${addr.slice(0, 8)}...${addr.slice(-8)}`);
    try {
      const balance = await fetchBalance(addr);
      Alert.alert('Wallet Balance', `${balance.toFixed(6)} SOL`);
    } catch (e) {
      console.warn('Failed to fetch balance after connection', e);
    }
  }, [fetchBalance]);

  const onDisconnected = useCallback(() => {
    // Redux state is already cleared by mobileWalletAdapter
    console.log('[Wallet] Disconnected');
  }, []);

  const refreshBalance = useCallback(async () => {
    if (!wallet.address) return;
    try {
      const balance = await fetchBalance(wallet.address);
      Alert.alert('Balance Refreshed', `${balance.toFixed(6)} SOL`);
    } catch (e) {
      Alert.alert('Error', 'Failed to refresh balance');
    }
  }, [wallet.address, fetchBalance]);

  const handleConfirm = useCallback(async () => {
    if (!sheetType) return;
    const amt = parseFloat(amount || '0');
    if (!amt || !wallet.address) return;
    setIsBusy(true);
    try {
      if (sheetType === 'deposit') {
        // Devnet-only convenience: airdrop
        const sig = await solana.connection.requestAirdrop(new PublicKey(wallet.address), Math.floor(amt * LAMPORTS_PER_SOL));
        await solana.connection.confirmTransaction(sig, 'confirmed');
        console.log('[Wallet] Deposit airdrop signature:', sig);
        Alert.alert('Deposit Successful', `${amt} SOL added to your wallet`);
        await refreshBalance();
      } else {
        // Withdraw: transfer from connected wallet to destination
        const dest = (destination || '').trim();
        if (!dest) throw new Error('Destination address required');
        const fromPubkey = new PublicKey(wallet.address);
        const toPubkey = new PublicKey(dest);
        const recent = await solana.getRecentBlockhash();
        const tx = new Transaction({ recentBlockhash: recent, feePayer: fromPubkey }).add(
          SystemProgram.transfer({ fromPubkey, toPubkey, lamports: Math.floor(amt * LAMPORTS_PER_SOL) })
        );
        const txSig = await solana.signAndSend(tx);
        console.log('[Wallet] Withdraw transaction signature:', txSig);
        Alert.alert('Withdraw Successful', `${amt} SOL sent`);
        await refreshBalance();
      }
      closeSheet();
    } catch (e) {
      console.warn('Wallet action failed', e);
      Alert.alert('Error', e instanceof Error ? e.message : 'Transaction failed');
    } finally {
      setIsBusy(false);
    }
  }, [sheetType, amount, wallet.address, destination, solana, refreshBalance]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <BlurView intensity={30} tint="dark" style={styles.header}>
          <Text style={styles.headerTitle}>Wallet</Text>
        </BlurView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>
            {wallet.solBalance === 0 && !wallet.connected ? '—' : `${wallet.solBalance.toFixed(4)} SOL`}
          </Text>
          <View style={styles.walletRow}>
            <WalletConnectButton onConnected={onConnected} onDisconnected={onDisconnected} />
            {wallet.address && (
              <Text style={styles.addressText}>
                {wallet.address.slice(0, 8)}...{wallet.address.slice(-8)}
              </Text>
            )}
            {wallet.connected && (
              <TouchableOpacity style={styles.refreshBtn} onPress={refreshBalance} disabled={isBusy || wallet.isLoading}>
                <Icon name={isBusy ? 'loading' : 'refresh'} size={18} color="#fff" />
                <Text style={styles.refreshText}>
                  {isBusy ? 'Refreshing...' : 'Refresh'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.depositButton, (!wallet.connected || isBusy) && styles.disabledButton]}
              onPress={() => openSheet('deposit')}
              disabled={!wallet.connected || isBusy}
              activeOpacity={0.8}>
              <Icon name="plus" size={20} color="#fff" />
              <Text style={styles.depositButtonText}>Deposit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.withdrawButton, (!wallet.connected || isBusy) && styles.disabledButton]}
              onPress={() => openSheet('withdraw')}
              disabled={!wallet.connected || isBusy}
              activeOpacity={0.8}>
              <Icon name="arrow-up" size={20} color="#179E66" />
              <Text style={styles.withdrawButtonText}>Withdraw</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Icon name="trending-up" size={20} color="#4CAF50" />
            <Text style={styles.statValue}>₹8,200</Text>
            <Text style={styles.statLabel}>Total Earnings</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Icon name="cash-multiple" size={20} color="#2196F3" />
            <Text style={styles.statValue}>₹15,300</Text>
            <Text style={styles.statLabel}>Total Invested</Text>
          </View>
        </View>

        {/* Transactions */}
        <View style={styles.transactionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {transactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </View>
      </ScrollView>

      {/* Bottom Sheet Modal */}
      <Modal
        visible={sheetType !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={closeSheet}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={closeSheet}>
            <BlurView intensity={20} style={StyleSheet.absoluteFill} />

            <Animated.View
              style={[
                styles.bottomSheet,
                { transform: [{ translateY: slideAnim }] },
              ]}>
              <TouchableOpacity activeOpacity={1}>
                <View style={styles.sheetHandle} />

                <ScrollView
                  style={styles.sheetContent}
                  keyboardShouldPersistTaps="handled"
                  automaticallyAdjustKeyboardInsets={true}
                  contentContainerStyle={{ flexGrow: 1 }}>
                <Text style={styles.sheetTitle}>
                  {sheetType === 'deposit' ? 'Add Money' : 'Withdraw Money'}
                </Text>

                {/* Amount Input */}
                <View style={styles.amountInputContainer}>
                  <Text style={styles.currencySymbol}>SOL</Text>
                  <TextInput
                    style={styles.amountInput}
                    value={amount}
                    onChangeText={setAmount}
                    placeholder="0.00"
                    placeholderTextColor="#666"
                    keyboardType="decimal-pad"
                    autoFocus={false}
                  />
                </View>

                {sheetType === 'withdraw' && (
                  <View style={styles.amountInputContainer}>
                    <Text style={styles.destLabel}>To</Text>
                    <TextInput
                      style={styles.amountInput}
                      value={destination}
                      onChangeText={setDestination}
                      placeholder="Destination address"
                      placeholderTextColor="#666"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                )}

                {/* Quick Amount Buttons */}
                <View style={styles.quickAmounts}>
                  {quickAmounts.map((amt) => (
                    <TouchableOpacity
                      key={amt}
                      style={styles.quickAmountButton}
                      onPress={() => setAmount(amt.toString())}
                      activeOpacity={0.7}>
                      <Text style={styles.quickAmountText}>{amt} SOL</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Confirm Button */}
                <TouchableOpacity
                  style={[styles.confirmButton, (isBusy || !wallet.connected) && styles.disabledButton]}
                  activeOpacity={0.8}
                  onPress={handleConfirm}
                  disabled={isBusy || !wallet.connected}
                >
                  <Text style={styles.confirmButtonText}>
                    {isBusy ? 'Processing...' : (sheetType === 'deposit' ? 'Request Airdrop' : 'Withdraw')}
                  </Text>
                </TouchableOpacity>

                {/* Info Text */}
                <Text style={styles.infoText}>
                  {sheetType === 'deposit'
                    ? 'Minimum deposit: ₹100'
                    : 'Minimum withdrawal: ₹500'}
                </Text>
                </ScrollView>
              </TouchableOpacity>
            </Animated.View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

function TransactionItem({ transaction }: any) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.96,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const getIcon = () => {
    switch (transaction.type) {
      case 'deposit':
        return 'arrow-down';
      case 'withdrawal':
        return 'arrow-up';
      case 'win':
        return 'trophy';
      default:
        return 'cash';
    }
  };

  const getColor = () => {
    switch (transaction.type) {
      case 'deposit':
        return '#4CAF50';
      case 'withdrawal':
        return '#F44336';
      case 'win':
        return '#FFB300';
      default:
        return '#999';
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={styles.transactionItem}
        onPress={handlePress}
        activeOpacity={0.9}>
        <View style={[styles.transactionIcon, { backgroundColor: `${getColor()}20` }]}>
          <Icon name={getIcon()} size={20} color={getColor()} />
        </View>

        <View style={styles.transactionDetails}>
          <Text style={styles.transactionType}>
            {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
          </Text>
          <Text style={styles.transactionDate}>{transaction.date}</Text>
        </View>

        <View style={styles.transactionRight}>
          <Text
            style={[
              styles.transactionAmount,
              { color: transaction.type === 'withdrawal' ? '#F44336' : '#4CAF50' },
            ]}>
            {transaction.type === 'withdrawal' ? '-' : '+'}₹
            {transaction.amount.toLocaleString()}
          </Text>
          <View
            style={[
              styles.statusBadge,
              transaction.status === 'pending' && styles.statusPending,
            ]}>
            <Text style={styles.statusText}>{transaction.status}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1913',
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'rgba(10, 10, 10, 0.7)',
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.5,
    fontFamily: 'AbrilFatface_400Regular',
  },
  scrollContent: {
    paddingTop: 120,
  },
  balanceCard: {
    backgroundColor: '#179E66',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 24,
    padding: 28,
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 8,
    
  },
  balanceAmount: {
    fontSize: 42,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'AbrilFatface_400Regular',
    marginBottom: 24,
  },
  walletRow: {
    marginBottom: 16,
  },
  addressText: {
    color: '#fff',
    marginTop: 8,
    fontSize: 12,
  },
  refreshBtn: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  refreshText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  depositButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  depositButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  withdrawButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  withdrawButtonText: {
    color: '#179E66',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#2A2A2A',
    marginHorizontal: 16,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
  },
  transactionsSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  seeAllText: {
    fontSize: 14,
    color: '#179E66',
    fontWeight: '600',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionType: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#999',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  statusBadge: {
    backgroundColor: '#4CAF5020',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusPending: {
    backgroundColor: '#FFB30020',
  },
  statusText: {
    fontSize: 11,
    color: '#4CAF50',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderColor: '#2A2A2A',
  },
  sheetHandle: {
    width: 36,
    height: 4,
    backgroundColor: '#3A3A3A',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  sheetContent: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  sheetTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 28,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F0F0F',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: '700',
    color: '#179E66',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
  },
  quickAmounts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
    gap: 12,
  },
  quickAmountButton: {
    flex: 1,
    minWidth: '22%',
    backgroundColor: '#2A2A2A',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  quickAmountText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#179E66',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 16,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  destLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#179E66',
    marginRight: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
});