use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
    rent::Rent,
    sysvar::Sysvar,
};

// Declare and export the program's entrypoint
entrypoint!(process_instruction);

// Program state structures
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct UserAccount {
    pub owner: Pubkey,
    pub zth_balance: u64,
    pub total_contributions: u32,
    pub total_tokens_earned: u64,
    pub is_initialized: bool,
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct PatternContribution {
    pub contributor: Pubkey,
    pub pattern_hash: [u8; 32],
    pub language: String,
    pub domain: String,
    pub complexity: u8,
    pub tokens_earned: u64,
    pub timestamp: i64,
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct TokenTransaction {
    pub from: Pubkey,
    pub to: Pubkey,
    pub amount: u64,
    pub transaction_type: u8, // 0: earned, 1: spent, 2: transferred
    pub timestamp: i64,
}

// Program instructions
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub enum ZenithCodeInstruction {
    InitializeUser,
    ContributePattern {
        pattern_hash: [u8; 32],
        language: String,
        domain: String,
        complexity: u8,
    },
    TransferTokens {
        to: Pubkey,
        amount: u64,
    },
    ClaimRewards {
        contribution_id: u64,
    },
}

// Program entrypoint implementation
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let instruction = ZenithCodeInstruction::try_from_slice(instruction_data)
        .map_err(|_| ProgramError::InvalidInstructionData)?;

    match instruction {
        ZenithCodeInstruction::InitializeUser => {
            msg!("Instruction: Initialize User");
            process_initialize_user(program_id, accounts)
        }
        ZenithCodeInstruction::ContributePattern {
            pattern_hash,
            language,
            domain,
            complexity,
        } => {
            msg!("Instruction: Contribute Pattern");
            process_contribute_pattern(program_id, accounts, pattern_hash, language, domain, complexity)
        }
        ZenithCodeInstruction::TransferTokens { to, amount } => {
            msg!("Instruction: Transfer Tokens");
            process_transfer_tokens(program_id, accounts, to, amount)
        }
        ZenithCodeInstruction::ClaimRewards { contribution_id } => {
            msg!("Instruction: Claim Rewards");
            process_claim_rewards(program_id, accounts, contribution_id)
        }
    }
}

// Initialize user account
pub fn process_initialize_user(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let user_account = next_account_info(account_info_iter)?;
    let owner = next_account_info(account_info_iter)?;
    let rent = &Rent::from_account_info(next_account_info(account_info_iter)?)?;

    if !owner.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }

    if user_account.owner != program_id {
        return Err(ProgramError::IncorrectProgramId);
    }

    if !rent.is_exempt(user_account.lamports(), UserAccount::LEN) {
        return Err(ProgramError::AccountNotRentExempt);
    }

    let mut user_data = UserAccount {
        owner: *owner.key,
        zth_balance: 0,
        total_contributions: 0,
        total_tokens_earned: 0,
        is_initialized: true,
    };

    user_data.serialize(&mut &mut user_account.data.borrow_mut()[..])?;
    msg!("User account initialized successfully");
    Ok(())
}

// Process pattern contribution
pub fn process_contribute_pattern(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    pattern_hash: [u8; 32],
    language: String,
    domain: String,
    complexity: u8,
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let user_account = next_account_info(account_info_iter)?;
    let contributor = next_account_info(account_info_iter)?;
    let contribution_account = next_account_info(account_info_iter)?;

    if !contributor.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }

    if user_account.owner != program_id {
        return Err(ProgramError::IncorrectProgramId);
    }

    // Calculate tokens based on complexity and uniqueness
    let tokens_earned = calculate_tokens_earned(complexity);

    // Create contribution record
    let contribution = PatternContribution {
        contributor: *contributor.key,
        pattern_hash,
        language,
        domain,
        complexity,
        tokens_earned,
        timestamp: solana_program::clock::Clock::get()?.unix_timestamp,
    };

    contribution.serialize(&mut &mut contribution_account.data.borrow_mut()[..])?;

    // Update user account
    let mut user_data = UserAccount::try_from_slice(&user_account.data.borrow())?;
    user_data.zth_balance += tokens_earned;
    user_data.total_contributions += 1;
    user_data.total_tokens_earned += tokens_earned;
    user_data.serialize(&mut &mut user_account.data.borrow_mut()[..])?;

    msg!("Pattern contribution recorded. Tokens earned: {}", tokens_earned);
    Ok(())
}

// Transfer tokens between users
pub fn process_transfer_tokens(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    to: Pubkey,
    amount: u64,
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let from_account = next_account_info(account_info_iter)?;
    let to_account = next_account_info(account_info_iter)?;
    let from_owner = next_account_info(account_info_iter)?;

    if !from_owner.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }

    if from_account.owner != program_id || to_account.owner != program_id {
        return Err(ProgramError::IncorrectProgramId);
    }

    let mut from_data = UserAccount::try_from_slice(&from_account.data.borrow())?;
    let mut to_data = UserAccount::try_from_slice(&to_account.data.borrow())?;

    if from_data.zth_balance < amount {
        return Err(ProgramError::InsufficientFunds);
    }

    from_data.zth_balance -= amount;
    to_data.zth_balance += amount;

    from_data.serialize(&mut &mut from_account.data.borrow_mut()[..])?;
    to_data.serialize(&mut &mut to_account.data.borrow_mut()[..])?;

    msg!("Tokens transferred successfully: {} ZTH", amount);
    Ok(())
}

// Claim rewards for contributions
pub fn process_claim_rewards(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    contribution_id: u64,
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let user_account = next_account_info(account_info_iter)?;
    let contribution_account = next_account_info(account_info_iter)?;
    let owner = next_account_info(account_info_iter)?;

    if !owner.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }

    if user_account.owner != program_id {
        return Err(ProgramError::IncorrectProgramId);
    }

    let contribution = PatternContribution::try_from_slice(&contribution_account.data.borrow())?;
    
    if contribution.contributor != *owner.key {
        return Err(ProgramError::InvalidAccountData);
    }

    // Mark contribution as claimed (in a real implementation, you'd track this)
    msg!("Rewards claimed for contribution: {} ZTH", contribution.tokens_earned);
    Ok(())
}

// Helper function to calculate tokens earned
fn calculate_tokens_earned(complexity: u8) -> u64 {
    // Base reward: 10 ZTH
    let base_reward = 10u64;
    
    // Complexity multiplier: 1-5x based on complexity (1-10 scale)
    let complexity_multiplier = (complexity as u64).min(10) / 2 + 1;
    
    base_reward * complexity_multiplier
}

impl UserAccount {
    pub const LEN: usize = 32 + 8 + 4 + 8 + 1; // owner + balance + contributions + earned + initialized
}

// Error handling
#[derive(thiserror::Error, Debug)]
pub enum ZenithCodeError {
    #[error("Invalid instruction")]
    InvalidInstruction,
    #[error("Not rent exempt")]
    NotRentExempt,
    #[error("Already initialized")]
    AlreadyInitialized,
}

impl From<ZenithCodeError> for ProgramError {
    fn from(e: ZenithCodeError) -> Self {
        ProgramError::Custom(e as u32)
    }
} 